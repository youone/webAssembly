// import $ from 'jquery';
// import 'ol/ol.css';
// import * as ol from 'ol';
// import VectorLayer from 'ol/layer/Vector';
// import TileLayer from 'ol/layer/Tile';
// import {Style, Fill} from 'ol/style';
// import OSM from 'ol/source/OSM';
// import VectorSource from 'ol/source/Vector';
// import Feature from 'ol/Feature';
// import Circle from 'ol/geom/Circle';
// import Polygon from 'ol/geom/Polygon';
// import LineString from 'ol/geom/LineString';
// import {transform} from 'ol/proj';

// import bindtest_asm from './wasm/bin/bindtest_asm.js'
import bindtest from './wasm/bearing.js';
// import bindtestModule from './wasm/bearing.wasm';
// const bindtestModule = 'bearing.wasm';


// const module = bindtest_asm();
// const module = bindtest({locateFile: function(path) {if(path.endsWith('.wasm')) {return bindtestModule;} return path;}});
const module = bindtest({locateFile: (path, prefix) => {
    console.log(path, prefix);
    return 'bearing.wasm';
}});

// const module = bindtest['locateFile'] = function(path, prefix) {
//     // if it's a mem init file, use a custom dir
//     if (path.endsWith(".wasm")) return bindtestModule;
//     // otherwise, use the default, the prefix (JS file's dir) + the path
//     return path;
// }

console.log(bindtest);

// fetch(bindtestModule).then(async (response) => {
//     let arrayBuffer = await response.arrayBuffer();
//     let wasmModule = await WebAssembly.instantiate(arrayBuffer, {});
//     console.log(wasmModule);
// })

// console.log(module, bindtestModule);

// let siteCoordsPtr, bearingsPtr, ellipsePtr, bearingLinesPtr;
// let siteLocations, bearings, ellipse, bearingLines;
// const nSites = 4;
// const nEllipsePoints = 50;
// const nBearingLinePoints = 25;
// let measuredBearings, sigma, bias;
//
// const dfSites = [{lon: 10, lat: 55},{lon: 15, lat: 60},{lon: 15, lat: 62},{lon: 10, lat: 65}];
//
// module.onRuntimeInitialized = () => {
//
//     siteCoordsPtr = module._malloc(2*nSites*64);
//     siteLocations = new Float64Array(module.HEAPU8.buffer, siteCoordsPtr, 2*nSites);
//
//     bearingsPtr = module._malloc(2*nSites*64);
//     bearings = new Float64Array(module.HEAPU8.buffer, bearingsPtr, 2*nSites);
//
//     siteLocations.set([10, 55, 15, 60, 15, 62, 10, 65]);
// };
//
// function nrandom() {
//     let u=0, v=0;
//     while(u===0) u = Math.random();
//     while(v===0) v = Math.random();
//     return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 *Math.PI * v);
// }
//
// function zipLatLon(linePoints, startLat, startLon, n) {
//     const mainLat = linePoints.slice(startLat, startLat + n);
//     const mainLon = linePoints.slice(startLon, startLon + n);
//     return mainLat.map((lat, i) => [mainLon[i], lat]);
// }
//
// let nShots = 0;
// let nHits = 0;
//
// $('<button>get bearings</button>').on('click', event => {
//
//     nShots++;
//
//     // const crossCoord = [50,60];
//     const crossCoord = [50*Math.random()-10, 30*Math.random()+45];
//     sigma = [2,2,2,2];
//     bias = [0,0,0,0];
//     const correctBearings = dfSites.map(s => {
//         return module.getBearing(s.lon, s.lat, crossCoord[0], crossCoord[1]);
//     });
//     measuredBearings = correctBearings.map((cb, i) => cb + sigma[i]*nrandom() + bias[i]*nrandom());
//
//     ellipsePtr = module._malloc(2*nEllipsePoints*64);
//     ellipse = new Float64Array(module.HEAPU8.buffer, ellipsePtr, 2*nEllipsePoints);
//
//     bearingLinesPtr = module._malloc(nSites*3*2*nBearingLinePoints*64);
//     bearingLines = new Float64Array(module.HEAPU8.buffer, bearingLinesPtr, nSites*3*2*nBearingLinePoints);
//
//     bearings.set(measuredBearings.concat(sigma));
//
//     const time = Date.now();
//     const data = module.myFunc(nSites, siteCoordsPtr, bearingsPtr, nEllipsePoints, nBearingLinePoints, ellipsePtr, bearingLinesPtr);
//     console.log(Date.now() - time);
//
//     // console.log(data.get('ellipseParameters').get(0), data.get('ellipseParameters').get(1), data.get('ellipseParameters').get(2)*180/Math.PI);
//
//     bearingSource.getFeatures().forEach(f => {
//         bearingSource.removeFeature(f);
//     });
//
//     let mainCoord;
//     bearingLines = [].slice.call(bearingLines);
//     for (let iSite=0; iSite < nSites; iSite++) {
//
//         const mainLatStartIndex = iSite * nBearingLinePoints * 2 * 3;
//         const mainLonStartIndex = mainLatStartIndex + nBearingLinePoints;
//         const upperLatStartIndex = mainLatStartIndex + 2*nBearingLinePoints;
//         const upperLonStartIndex = mainLatStartIndex + 3*nBearingLinePoints;
//         const lowerLatStartIndex = mainLatStartIndex + 4*nBearingLinePoints;
//         const lowerLonStartIndex = mainLatStartIndex + 5*nBearingLinePoints;
//
//         mainCoord = zipLatLon(bearingLines, mainLatStartIndex, mainLonStartIndex,  nBearingLinePoints);
//
//         const bearingCoord = mainCoord.map(c => transform(c, 'EPSG:4326', 'EPSG:3857'));
//
//         const bearingGeometry = new LineString(bearingCoord);
//         const bearingErrorGeometry = new Polygon([bearingCoord]);
//
//         bearingSource.addFeature(new Feature({
//             name: 'bearing1',
//             geometry: bearingGeometry,
//
//         }));
//     }
//
//     ellipse = [].slice.call(ellipse);
//     const ellipseCoord = zipLatLon(ellipse,0, nEllipsePoints, nEllipsePoints).map(c => transform(c, 'EPSG:4326', 'EPSG:3857'));
//     const ellipseGeometry = new Polygon([ellipseCoord]);
//     const crossGeometry = new Circle(transform(crossCoord, 'EPSG:4326', 'EPSG:3857'), 20000);
//
//     const ellipseFeature = new Feature({
//         name: 'ellipse',
//         geometry: ellipseGeometry,
//     });
//
//     ellipseFeature.setStyle(new Style({
//         fill: new Fill({
//             color: 'rgba(255,0,0,0.3)'
//         })
//     }));
//
//     const crossFeature = new Feature({
//         name: 'cross',
//         geometry: crossGeometry,
//     });
//
//     crossFeature.setStyle(new Style({
//         fill: new Fill({
//             color: 'rgba(255,0,0,1)'
//         })
//     }));
//
//     bearingSource.addFeature(crossFeature);
//     bearingSource.addFeature(ellipseFeature);
//
//     if (ellipseGeometry.intersectsCoordinate(transform(crossCoord, 'EPSG:4326', 'EPSG:3857'))) {
//         nHits++;
//     }
//     console.log(nHits/nShots);
//
//     module._free(ellipsePtr);
//     module._free(bearingLinesPtr);
//
// }).appendTo('body');
//
// const mapdiv = $('<div>').appendTo('body');
//
// const bearingSource = new VectorSource({});
//
// const bearingLayer  = new VectorLayer({
//     source: bearingSource
// });
//
// const map = new ol.Map({
//
//     target: mapdiv[0],
//     layers: [
//         new TileLayer({
//             source: new OSM(),
//         }),
//         bearingLayer
//     ],
//     view: new ol.View({
//         center: transform([20, 60], 'EPSG:4326', 'EPSG:3857'),
//         // center: [0,0],
//         zoom: 4
//     })
// });
