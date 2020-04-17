import $ from 'jquery';
import 'ol/ol.css';
import * as ol from 'ol';
import VectorLayer from 'ol/layer/Vector';
import TileLayer from 'ol/layer/Tile';
import {Style, Fill, Stroke, Icon, Circle as CircleStyle} from 'ol/style';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Circle from 'ol/geom/Circle';
import Point from 'ol/geom/Point';
import Polygon from 'ol/geom/Polygon';
import LineString from 'ol/geom/LineString';
import {transform} from 'ol/proj';
import * as dum from '.';

// import XYZ from 'ol/source/XYZ.js';
// import View from 'ol/View.js';
// import * as olProj from 'ol/proj.js';
// // import Cesium from 'cesium/Cesium';
// import Cesium from '../node_modules/cesium/Source/Cesium'
// window.Cesium = Cesium; // expose Cesium to the OL-Cesium library
// import('../node_modules/cesium/Source/Widgets/widgets.css');
// import OLCesium from 'ol-cesium';

let siteCoordsPtr, bearingsPtr, ellipsePtr, bearingLinesPtr;
let siteLocations, bearings, ellipse, bearingLines;
const nEllipsePoints = 50;
const nBearingLinePoints = 25;
let measuredBearings, sigma, bias;

// const dfSites = [{lon: 13, lat: 55},{lon: 18, lat: 57}]; sigma = [2,2]; bias = [0,0];
const dfSites = [{lon: 13, lat: 55},{lon: 18, lat: 57},{lon: 19, lat: 65}]; sigma = [2,2,2]; bias = [0,0,0];
// const dfSites = [{lon: 10, lat: 55},{lon: 15, lat: 60},{lon: 15, lat: 62}]; sigma = [2,2,2]; bias = [0,0,0];
// const dfSites = [{lon: 10, lat: 55},{lon: 15, lat: 60},{lon: 15, lat: 62},{lon: 10, lat: 65}]; sigma = [2,2,2,2]; bias = [0,0,0,0];
// const dfSites = [{lon: 10, lat: 55},{lon: 15, lat: 60},{lon: 15, lat: 62},{lon: 10, lat: 65},{lon: 12, lat: 63}]; sigma = [2,2,2,2,2]; bias = [0,0,0,0,0];

const nSites = dfSites.length;

let bearingMod = null;
bearingMod = dum.loadModule({dfSites: dfSites}).then(bm => bearingMod = bm);

function nrandom() {
    let u=0, v=0;
    while(u===0) u = Math.random();
    while(v===0) v = Math.random();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 *Math.PI * v);
}

function zipLatLon(linePoints, startLat, startLon, n) {
    const mainLat = linePoints.slice(startLat, startLat + n);
    const mainLon = linePoints.slice(startLon, startLon + n);
    return mainLat.map((lat, i) => [mainLon[i], lat]);
}

let nShots = 0;
let nHits = 0;

// $('<button id="3dButton">3D</button>').on('click', event => {
//     ol3d.setEnabled(!ol3d.getEnabled());
// }).appendTo('body');

class MarkerFeature extends Feature {

    constructor(coordinates, color) {
        super();
        // this.setId(name, 'hej');
        this.setGeometry(new Point(transform(coordinates, 'EPSG:4326', 'EPSG:3857')));
        // this.setGeometry(new Circle(transform(coordinates, 'EPSG:4326', 'EPSG:3857'), 30000));
        // let style = new FacilityFeatureStyle("Marker", [0.5,1], null);
        const iconStyle = new Style({
            image: new CircleStyle({
                radius: 3,
                fill: new Fill({
                    color: color
                })
            }),
            // image: new Icon({
            //     // color: '#8959A8',
            //     // crossOrigin: 'anonymous',
            //     anchor: [0.5, 0.5],
            //     size: [52, 52],
            //     // offset: [52, 0],
            //     // opacity: 0.5,
            //     scale: 1.0,
            //     src: 'https://openlayers.org/en/v3.20.1/examples/data/icon.png'
            // })
        });
        this.setStyle(iconStyle);
    }
}


function generateBearings(crossCoord) {

    bearingSource.getFeatures().forEach(f => {
        bearingSource.removeFeature(f);
    });

    nShots++;

    const correctBearings = bearingMod.getBearings(crossCoord[0], crossCoord[1]);

    measuredBearings = correctBearings.map((cb, i) => cb + sigma[i]*nrandom() + bias[i]*nrandom());
    // measuredBearings = correctBearings.map((cb, i) => cb + 0*nrandom() + bias[i]*nrandom());

    bearingSource.addFeature(new MarkerFeature(crossCoord, 'blue'));

    let fitOk;
    let crossGuess;
    let ellipseParameters;
    const time = Date.now();

    let {metaData, ellipse, bearingLines} = bearingMod.getFixEstimate(measuredBearings, sigma, nEllipsePoints, nBearingLinePoints);

    fitOk = metaData.get('fitStatus').get(0);
    crossGuess = metaData.get('crossGuess');
    ellipseParameters = metaData.get('ellipseParameters');

    bearingSource.addFeature(new MarkerFeature([ellipseParameters.get(0), ellipseParameters.get(1)], 'red'));
    // bearingSource.addFeature(new MarkerFeature([crossGuess.get(0), crossGuess.get(1)], 'black'));
    console.log('TIME: ', Date.now() - time);

    let mainCoord;
    bearingLines = [].slice.call(bearingLines);
    for (let iSite=0; iSite < nSites; iSite++) {

        const mainLatStartIndex = iSite * nBearingLinePoints * 2 * 3;
        const mainLonStartIndex = mainLatStartIndex + nBearingLinePoints;
        const upperLatStartIndex = mainLatStartIndex + 2*nBearingLinePoints;
        const upperLonStartIndex = mainLatStartIndex + 3*nBearingLinePoints;
        const lowerLatStartIndex = mainLatStartIndex + 4*nBearingLinePoints;
        const lowerLonStartIndex = mainLatStartIndex + 5*nBearingLinePoints;

        mainCoord = zipLatLon(bearingLines, mainLatStartIndex, mainLonStartIndex,  nBearingLinePoints);

        const bearingCoord = mainCoord.map(c => transform(c, 'EPSG:4326', 'EPSG:3857'));


        const bearingGeometry = new LineString(bearingCoord);
        const bearingErrorGeometry = new Polygon([bearingCoord]);

        console.log('BEARINGS: ', bearingCoord);

        bearingSource.addFeature(new Feature({
            name: 'bearing1',
            geometry: bearingGeometry,

        }));
    }

    console.log(ellipseParameters.get(3), ellipseParameters.get(4));

    // if (fitOk && ellipseParameters.get(4) < 500) {
    if (fitOk) {
        // console.log('ELLIPSE: ', ellipse);
        ellipse = [].slice.call(ellipse);
        const ellipseCoord = zipLatLon(ellipse,0, nEllipsePoints, nEllipsePoints)
            .map(c => transform(c, 'EPSG:4326', 'EPSG:3857'))
            .filter(c => !isNaN(c[1]));
        const ellipseGeometry = new Polygon([ellipseCoord]);

        console.log(zipLatLon(ellipse,0, nEllipsePoints, nEllipsePoints));
        console.log(ellipseCoord);

        const ellipseFeature = new Feature({
            name: 'ellipse',
            geometry: ellipseGeometry,
        });
        ellipseFeature.setStyle(new Style({
            fill: new Fill({
                color: 'rgba(255,0,0,0.3)'
            })
        }));
        bearingSource.addFeature(ellipseFeature);

        if (ellipseGeometry.intersectsCoordinate(transform(crossCoord, 'EPSG:4326', 'EPSG:3857'))) {
            nHits++;
        }
        console.log('HIIIIT', nHits/nShots);
    }
    else {
        console.error('FIT PROBLEM!', fitOk, ellipseParameters.get(3), ellipseParameters.get(4));
        // $('#gbButton').hide();
    }

    bearingMod.free();
}

$('<button id="gbButton">get bearings</button>').on('click', event => {


    // const lonWidth = 0; const lonMean = 36; const latWidth = 0; const latMean = 67;
    // const lonWidth = 0; const lonMean = -8; const latWidth = 0; const latMean = 69;
    // const lonWidth = 0; const lonMean = -2; const latWidth = 0; const latMean = 57;
    // const lonWidth = 0; const lonMean = 23; const latWidth = 0; const latMean = 56;
    // const lonWidth = 0; const lonMean = 35; const latWidth = 0; const latMean = 71;
    // const lonWidth = 0; const lonMean = 2; const latWidth = 0; const latMean = 46;
    // const lonWidth = 0; const lonMean = 30; const latWidth = 0; const latMean = 46;
    // const lonWidth = 0; const lonMean = 24; const latWidth = 0; const latMean = 55;

    const lonWidth = 50; const lonMean = -10; const latWidth = 30; const latMean = 45;
    // const lonWidth = 0; const lonMean = 10; const latWidth = 0; const latMean = 65;
    // const lonWidth = 0; const lonMean = 35; const latWidth = 0; const latMean = 70;
    // const lonWidth = 2, lonMean = 61, latWidth = 4, latMean = 8;
    // const crossCoord = [latWidth*Math.random()+latMean, lonWidth*Math.random()+latMean];

    const crossCoord = [lonWidth*Math.random()+lonMean, latWidth*Math.random()+latMean];

    generateBearings(crossCoord);

}).appendTo('body');

const mapdiv = $('<div>').appendTo('body');

const bearingSource = new VectorSource({});

const bearingLayer  = new VectorLayer({
    source: bearingSource
});

const map = new ol.Map({
    target: mapdiv[0],
    layers: [
        new TileLayer({
            source: new OSM(),
        }),
        bearingLayer
    ],
    view: new ol.View({
        center: transform([20, 60], 'EPSG:4326', 'EPSG:3857'),
        // center: [0,0],
        zoom: 4
    })
});

map.on('click', function (evt) {
    generateBearings(transform(evt.coordinate, 'EPSG:3857', 'EPSG:4326'));
});

// let tileWorldImagery = new TileLayer({
//     source: new XYZ({
//         url: 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
//         crossOrigin: 'Anonymous',
//     })
// });
// const map = new ol.Map({
//     target: mapdiv[0],
//     projection: 'EPSG:3857',
//     layers: [
//         // tileWorldImagery
//         new TileLayer({
//             source: new OSM(),
//         }),
//         bearingLayer
//     ],
//     view: new View({
//         center: transform([20, 60], 'EPSG:4326', 'EPSG:3857'),
//         zoom: 4,
//         minZoom: 2,
//     }),
// });
// const ol3d = new OLCesium({map: map}); // map is the ol.Map instance
// ol3d.setEnabled(false);
// window.ol3d = ol3d; // temporary hack for easy console debugging
