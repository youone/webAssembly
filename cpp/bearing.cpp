//#include <emscripten/emscripten.h>
#include <emscripten/bind.h>
#include <stdio.h>
#include <iostream>
#include <exception>
#include <cmath>
#include <vector>
#include <map>
#include <eigen3/Eigen/Dense>
#include <GeographicLib/Geodesic.hpp>
#include <GeographicLib/Geocentric.hpp>
#include <GeographicLib/GeodesicLine.hpp>

using namespace GeographicLib;
using namespace emscripten;
//using Eigen::MatrixXd;
using namespace Eigen;

const double PI = 3.14159265358979;

Vector3d geographic2cartesian(Vector2d location) {
    double latitude = location[0];
    double longitude = location[1];
    double theta = (90 - latitude) * PI / 180;
    double phi = longitude * PI / 180;
    Vector3d ret;
    ret << sin(theta) * cos(phi), sin(theta) * sin(phi), cos(theta);
    return ret;
}

Vector2d cartesian2geographic(Vector3d x) {
    x.normalize();
    double phi = atan(x[1]/x[0]);
    if (x[0] < 0) phi = PI + phi;
    double theta = acos(x[2]);
    double latitude = 90 - (theta * 180 / PI);
    double longitude = phi * 180 / PI;
    Vector2d ret;
    ret << latitude, longitude;
    return ret;
}

Vector3d bearingPlane(Vector2d location, double bearing) {
    double latitude = location[0];
    double longitude = location[1];
    Vector3d localUpVector = geographic2cartesian(location);  // pointing up
    Vector3d localEWVector;
    localEWVector << -sin(longitude * PI / 180), cos(longitude * PI / 180), 0.0; // pointing east
    Vector3d localNSVector = localUpVector.cross(localEWVector);  //pointing north
    Vector3d bearingVector = sin(bearing * PI / 180) * localEWVector + cos(bearing * PI / 180) * localNSVector;
    Vector3d bearingPlaneNormal = localUpVector.cross(bearingVector);
    //normalize_vector(bearingPlaneNormal)
    return bearingPlaneNormal;
}

Vector4d bearingCrossLocation(Vector2d location1, double bearing1, Vector2d location2, double bearing2) {
    Vector3d bp1 = bearingPlane(location1, bearing1);
    Vector3d bp2 = bearingPlane(location2, bearing2);
    Vector2d crossPair1 = cartesian2geographic(bp2.cross(bp1));
    Vector2d crossPair2 = cartesian2geographic(bp1.cross(bp2));
    Vector4d result;
    if (crossPair1(0) < 0) {
        result << crossPair1(0), crossPair1(1), crossPair2(0), crossPair2(1);
    }
    else {
        result << crossPair2(0), crossPair2(1), crossPair1(0), crossPair1(1);
    }
//    result << crossPair1, crossPair2;
    return result;
//    return crossPair1;
}

// azimuth between two geographic locations
double geodesicInverse(VectorXd p1, VectorXd p2) {
  const Geodesic& geodesic = Geodesic::WGS84();
  double s12, azi1, azi2;
  geodesic.Inverse(p2[1], p2[0], p1[1], p1[0], s12, azi1, azi2);
  if (azi1 < 0) {
    return 360+azi1;
  }
  else {
    return azi1;
  }
}

MatrixXd finalEigenvecs;

void getEllipsePoints(int n, Vector2d center, double major, double minor, double* result) {

    MatrixXd ellipseBaseVectors;
    double a,b;
    if (finalEigenvecs(0,0)*finalEigenvecs(1,1)-finalEigenvecs(1,0)*finalEigenvecs(0,1) > 0) {
        ellipseBaseVectors = finalEigenvecs.rowwise().reverse();
        a=minor; b=major;
    }
    else {
        ellipseBaseVectors = finalEigenvecs;
        a=major; b=minor;
    }

    for (int i=0; i<n; i++) {
        Vector2d x;
        x << b*cos(2*PI*i/n), a*sin(2*PI*i/n);
        Vector2d xrot = ellipseBaseVectors.inverse() * x;
        result[i] = center[1] + xrot(1);
        result[i + n] = center[0] + xrot(0);
    }
}

void getBearingPoints(int n, MatrixXd siteCoords, VectorXd bearings, VectorXd sigmas, double* result) {
    const Geodesic& geod = Geodesic::WGS84();

    int nSites = siteCoords.col(0).size();
    for (int iSite=0; iSite < nSites; iSite++) {

//        std::cout << "SITES: " << siteCoords(iSite,1) << " " << siteCoords(iSite,0) << std::endl;

        const GeodesicLine& mainLine = geod.Line(siteCoords(iSite,1), siteCoords(iSite,0), bearings(iSite), Geodesic::ALL);
        const GeodesicLine& upperLine = geod.Line(siteCoords(iSite,1), siteCoords(iSite,0), bearings(iSite) + sigmas(iSite), Geodesic::ALL);
        const GeodesicLine& lowerLine = geod.Line(siteCoords(iSite,1), siteCoords(iSite,0), bearings(iSite) - sigmas(iSite), Geodesic::ALL);

        int mainLatStartIndex = iSite * n * 2 * 3;
        int mainLonStartIndex = mainLatStartIndex + 1*n;
        int upperLatStartIndex = mainLatStartIndex + 2*n;
        int upperLonStartIndex = mainLatStartIndex + 3*n;
        int lowerLatStartIndex = mainLatStartIndex + 4*n;
        int lowerLonStartIndex = mainLatStartIndex + 5*n;

        for (int i=0; i<n; i++) {
            mainLine.Position(100000*i, result[mainLatStartIndex + i], result[mainLonStartIndex + i]);
            upperLine.Position(100000*i, result[upperLatStartIndex + i], result[upperLonStartIndex + i]);
            lowerLine.Position(100000*i, result[lowerLatStartIndex + i], result[lowerLonStartIndex + i]);
        }

    }
//    std::cout << "SITES: " << siteCoords << std::endl;
//    std::cout << "SITES: " << siteCoords.col(0).size() << std::endl;
//    std::cout << "BEARINGS: " << bearings << std::endl;
//    std::cout << "SIGMAS: " << sigmas << std::endl;
}

//MatrixXd finalEigenvecs;

VectorXd solveIterationSphere(int n, MatrixXd siteCoord, VectorXd bearingMeasured, VectorXd sigma, VectorXd crossGuess, double* angle, double* ev1, double* ev2) {

    MatrixXd G(n,2), P, bearingDiff(n,1), eigenvectors;
    MatrixXd N(n,n);
    VectorXd bearingGuess(n), crossImproved(2);

    for (int i=0; i<n; i++) {
//        std::cout << n << " " << i << " test1: " << crossGuess.transpose() << std::endl;
        bearingGuess(i) = geodesicInverse(crossGuess, siteCoord.row(i));
//        std::cout << "test2: " << std::endl;
        VectorXd dx1(2), dx2(2);
        dx1 << 1.0e-5/2, 0;
        dx2 << 0, 1.0e-5/2;

        double derivative1 = (-geodesicInverse(crossGuess - dx1, siteCoord.row(i)) + geodesicInverse(crossGuess + dx1, siteCoord.row(i)))/1.0e-5;
        double derivative2 = (-geodesicInverse(crossGuess - dx2, siteCoord.row(i)) + geodesicInverse(crossGuess + dx2, siteCoord.row(i)))/1.0e-5;

        G(i,0) = derivative1;
        G(i,1) = derivative2;

        for (int j=0; j<n; j++) {N(i,j) = 0;}
        N(i,i) = sigma(i)*sigma(i);
    }

    P = (G.transpose() * N.inverse() * G).inverse();
    bearingDiff << bearingMeasured - bearingGuess;
    crossImproved = crossGuess + (P * G.transpose() * N.inverse()) * bearingDiff;

    //calculate the ellipse
    SelfAdjointEigenSolver<MatrixXd> eigensolver(P);
    eigenvectors = eigensolver.eigenvectors();

    double theta = -asin(eigenvectors(1,1));
//    double theta = PI/2 - acos(eigenvectors(0,0));
//    if (eigenvectors(0,1) > 0) {
//        theta = acos(eigenvectors(0,0)) - PI/2;
//    }

    finalEigenvecs = eigenvectors;

//    std::cout << "G: " << std::endl << G << std::endl;
//    std::cout << "N: " << std::endl << N << std::endl;
//    std::cout << "P: " << std::endl << P << std::endl;
//    std::cout << "EV: " << std::endl << eigenvectors << std::endl;

    *angle = theta;
    *ev1 = eigensolver.eigenvalues()(0);
    *ev2 = eigensolver.eigenvalues()(1);

    return crossImproved;
}

std::map<std::string, std::vector<double>> myFunc(
    int n,
    uint32_t siteCoordsPtr,
    uint32_t bearingsPtr,
    int nEllipsePoints,
    int nBearingLinePoints,
    uint32_t ellipsePtr,
    uint32_t bearingLinesPtr
    ) {

    double siteLocations[n][2];
    memcpy(siteLocations, reinterpret_cast<double*>(siteCoordsPtr), 2*n*sizeof(double));

    double bearings[2*n];
    memcpy(bearings, reinterpret_cast<double*>(bearingsPtr), 2*n*sizeof(double));

    double* ellipse = reinterpret_cast<double*>(ellipsePtr);

    double* bearingLines = reinterpret_cast<double*>(bearingLinesPtr);

    MatrixXd siteCoord(n,2);
    VectorXd siteBearings(n), sigmas(n), crossGuess(2);

    for (int i=0; i<n; i++) {
        siteCoord(i,0) = siteLocations[i][0];
        siteCoord(i,1) = siteLocations[i][1];
        siteBearings(i) = bearings[i];
        sigmas(i) = bearings[i + n];
//        std::cout << "SITE: " << siteCoord(i,0) << " " << siteCoord(i,1) << " " << bearings[i] << std::endl;
    }

//    std::cout << "MEASURED BEARINGS: " << siteBearings.transpose() << std::endl;
//    std::cout << "MEASURED SIGMAS: " << sigmas.transpose() << std::endl;

    MatrixXd crossCoordinates(6,2);
    double meanLat = 0, meanLon = 0;
    int nComb = 0;
    for(int i=0; i<n; i++) {
        for(int j=0; j<n; j++) {
            Vector2d coordi, coordj;
            if (i < j) {
                coordi << siteCoord.row(i)[1], siteCoord.row(i)[0];
                coordj << siteCoord.row(j)[1], siteCoord.row(j)[0];

                Vector4d crosses = bearingCrossLocation(coordi, siteBearings[i], coordj, siteBearings[j]);
                meanLat += crosses(2);
                meanLon += crosses(3);
                crossCoordinates(nComb, 0) = crosses(2);
                crossCoordinates(nComb, 1) = crosses(3);

                nComb++;

//                std::cout << "CROSS: "
//                << i+1 << " " << j+1 << " - "
//                << coordi.transpose() << " "
//                << siteBearings[i] << ", "
//                << coordj.transpose() << " "
//                << siteBearings[j] << " ... "
//                << crosses.transpose() << std::endl;
            }
        }
    }

    double crossMeanLat, crossMeanLon, crossMinDistance=1000000;
    for(int i=0; i<nComb; i++) {
        for(int j=0; j<nComb; j++) {
            if (i < j) {
                double crossDistance = sqrt(
                   pow(crossCoordinates(i,0)-crossCoordinates(j,0),2) +
                   pow(crossCoordinates(i,1)-crossCoordinates(j,1),2)
                   );
                   if (crossDistance < crossMinDistance) {
                       crossMinDistance = crossDistance;
                       crossMeanLat = crossCoordinates(i,0);
                       crossMeanLon = crossCoordinates(i,1);
//                       crossMeanLat = (crossCoordinates(i,0)+crossCoordinates(j,0))/2;
//                       crossMeanLon = (crossCoordinates(i,1)+crossCoordinates(j,1))/2;
                   }
//                std::cout << "CROSS DISTANCE: "
//                << i << ","
//                << j << "  - "
//                << crossCoordinates.row(i) << " - "
//                << crossCoordinates.row(j) << " - "
//                << crossDistance <<
//                std::endl;
            }
        }
    }

//   crossGuess << meanLon/nComb, meanLat/nComb;
   crossGuess << crossMeanLon, crossMeanLat;
//   std::cout << "CROSS REFERENCE: " << crossGuess.transpose() << std::endl;
////   std::cout << "CROSS REFERENCE2: " << crossMeanLon << ", " << crossMeanLat << std::endl;

   double angle, ev1, ev2;
   std::map<std::string, VectorXd> result;
   VectorXd crossImproved1 = solveIterationSphere(n, siteCoord, siteBearings, sigmas, crossGuess, &angle, &ev1, &ev2);
   VectorXd crossImproved2 = solveIterationSphere(n, siteCoord, siteBearings, sigmas, crossImproved1, &angle, &ev1, &ev2);
   VectorXd crossImproved3 = solveIterationSphere(n, siteCoord, siteBearings, sigmas, crossImproved2, &angle, &ev1, &ev2);
   VectorXd crossImproved4 = solveIterationSphere(n, siteCoord, siteBearings, sigmas, crossImproved3, &angle, &ev1, &ev2);

//   double ellipsePoints[nEllipsePoints][2];
   getEllipsePoints(nEllipsePoints, crossImproved4, 1*sqrt(-2*log(1-0.95)*ev2), 1*sqrt(-2*log(1-0.95)*ev1), ellipse);
   getBearingPoints(nBearingLinePoints ,siteCoord, siteBearings, sigmas, bearingLines);

   std::cout << "ELLIPSE: " << angle * 180/PI << ", " << ev1 << " " << ev2 << std::endl;
//   std::cout << "CROSS COORD: " << crossImproved4.transpose() << std::endl;
//   std::cout << "ERROR: " << (crossImproved4-crossImproved3).transpose() << std::endl;

   std::vector<double> ellipseParameters(5);
   ellipseParameters[0] = crossImproved4(0);
   ellipseParameters[1] = crossImproved4(1);
   ellipseParameters[2] = angle;
   ellipseParameters[3] = ev1;
   ellipseParameters[4] = ev2;

   std::vector<double> lastEigen(4);
   lastEigen[0] = finalEigenvecs(0,0);
   lastEigen[1] = finalEigenvecs(1,0);
   lastEigen[2] = finalEigenvecs(0,1);
   lastEigen[3] = finalEigenvecs(1,1);

    std::map<std::string, std::vector<double>> m;
    m["ellipseParameters"] = ellipseParameters;
    m["eigenVectors"] = lastEigen;

    return m;
}

double getBearing(double lat1, double lon1, double lat2, double lon2) {
    Vector2d location1, location2;
    location1 << lon1, lat1;
    location2 << lon2, lat2;
    return geodesicInverse(location2, location1);
}


EMSCRIPTEN_BINDINGS(MyLib) {
  function("getBearing", &getBearing);
  function("myFunc", &myFunc, allow_raw_pointers());
  register_vector<double>("vector<double>");
  register_map<std::string, std::vector<double>>("map<string, vector<double>>");
}