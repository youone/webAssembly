(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["wasm"] = factory();
	else
		root["wasm"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// install a JSONP callback for chunk loading
/******/ 	function webpackJsonpCallback(data) {
/******/ 		var chunkIds = data[0];
/******/ 		var moreModules = data[1];
/******/
/******/
/******/ 		// add "moreModules" to the modules object,
/******/ 		// then flag all "chunkIds" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0, resolves = [];
/******/ 		for(;i < chunkIds.length; i++) {
/******/ 			chunkId = chunkIds[i];
/******/ 			if(Object.prototype.hasOwnProperty.call(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 				resolves.push(installedChunks[chunkId][0]);
/******/ 			}
/******/ 			installedChunks[chunkId] = 0;
/******/ 		}
/******/ 		for(moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				modules[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(parentJsonpFunction) parentJsonpFunction(data);
/******/
/******/ 		while(resolves.length) {
/******/ 			resolves.shift()();
/******/ 		}
/******/
/******/ 	};
/******/
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// object to store loaded and loading chunks
/******/ 	// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 	// Promise = chunk loading, 0 = chunk loaded
/******/ 	var installedChunks = {
/******/ 		"index": 0
/******/ 	};
/******/
/******/
/******/
/******/ 	// script path function
/******/ 	function jsonpScriptSrc(chunkId) {
/******/ 		return __webpack_require__.p + "" + ({}[chunkId]||chunkId) + ".js"
/******/ 	}
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/ 	// This file contains only the entry chunk.
/******/ 	// The chunk loading function for additional chunks
/******/ 	__webpack_require__.e = function requireEnsure(chunkId) {
/******/ 		var promises = [];
/******/
/******/
/******/ 		// JSONP chunk loading for javascript
/******/
/******/ 		var installedChunkData = installedChunks[chunkId];
/******/ 		if(installedChunkData !== 0) { // 0 means "already installed".
/******/
/******/ 			// a Promise means "currently loading".
/******/ 			if(installedChunkData) {
/******/ 				promises.push(installedChunkData[2]);
/******/ 			} else {
/******/ 				// setup Promise in chunk cache
/******/ 				var promise = new Promise(function(resolve, reject) {
/******/ 					installedChunkData = installedChunks[chunkId] = [resolve, reject];
/******/ 				});
/******/ 				promises.push(installedChunkData[2] = promise);
/******/
/******/ 				// start chunk loading
/******/ 				var script = document.createElement('script');
/******/ 				var onScriptComplete;
/******/
/******/ 				script.charset = 'utf-8';
/******/ 				script.timeout = 120;
/******/ 				if (__webpack_require__.nc) {
/******/ 					script.setAttribute("nonce", __webpack_require__.nc);
/******/ 				}
/******/ 				script.src = jsonpScriptSrc(chunkId);
/******/
/******/ 				// create error before stack unwound to get useful stacktrace later
/******/ 				var error = new Error();
/******/ 				onScriptComplete = function (event) {
/******/ 					// avoid mem leaks in IE.
/******/ 					script.onerror = script.onload = null;
/******/ 					clearTimeout(timeout);
/******/ 					var chunk = installedChunks[chunkId];
/******/ 					if(chunk !== 0) {
/******/ 						if(chunk) {
/******/ 							var errorType = event && (event.type === 'load' ? 'missing' : event.type);
/******/ 							var realSrc = event && event.target && event.target.src;
/******/ 							error.message = 'Loading chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')';
/******/ 							error.name = 'ChunkLoadError';
/******/ 							error.type = errorType;
/******/ 							error.request = realSrc;
/******/ 							chunk[1](error);
/******/ 						}
/******/ 						installedChunks[chunkId] = undefined;
/******/ 					}
/******/ 				};
/******/ 				var timeout = setTimeout(function(){
/******/ 					onScriptComplete({ type: 'timeout', target: script });
/******/ 				}, 120000);
/******/ 				script.onerror = script.onload = onScriptComplete;
/******/ 				document.head.appendChild(script);
/******/ 			}
/******/ 		}
/******/ 		return Promise.all(promises);
/******/ 	};
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// on error function for async loading
/******/ 	__webpack_require__.oe = function(err) { console.error(err); throw err; };
/******/
/******/ 	var jsonpArray = window["webpackJsonpwasm"] = window["webpackJsonpwasm"] || [];
/******/ 	var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);
/******/ 	jsonpArray.push = webpackJsonpCallback;
/******/ 	jsonpArray = jsonpArray.slice();
/******/ 	for(var i = 0; i < jsonpArray.length; i++) webpackJsonpCallback(jsonpArray[i]);
/******/ 	var parentJsonpFunction = oldJsonpFunction;
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! exports provided: loadWasmModule, loadModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"loadWasmModule\", function() { return loadWasmModule; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"loadModule\", function() { return loadModule; });\nconst exports = {\r\n    bearing: ['getBearing', 'getEllipse', '_malloc', 'HEAPU8', '_free', 'testFunc'],\r\n    fft: []\r\n};\r\n\r\nfunction loadWasmModule(moduleName) {\r\n    return new Promise(resolve => {\r\n        __webpack_require__(\"./src/wasm lazy recursive ^\\\\.\\\\/.*_wasm\\\\.js$\")(`./${moduleName}_wasm.js`).then(module => {\r\n            const mod = module.default({locateFile: (path, prefix) => {\r\n                    return `${moduleName}_wasm.wasm`;\r\n                }});\r\n            mod.onRuntimeInitialized = () => {\r\n\r\n                // siteCoordsPtr = module._malloc(2*nSites*64);\r\n                // siteLocations = new Float64Array(module.HEAPU8.buffer, siteCoordsPtr, 2*nSites);\r\n                //\r\n                // bearingsPtr = module._malloc(2*nSites*64);\r\n                // bearings = new Float64Array(module.HEAPU8.buffer, bearingsPtr, 2*nSites);\r\n                //\r\n                const exportedFunctions = {};\r\n                exports[moduleName].map(modName => {\r\n                    exportedFunctions[modName] = mod[modName];\r\n                });\r\n                resolve(exportedFunctions);\r\n            }\r\n        });\r\n    })\r\n}\r\n\r\nclass Bearing {\r\n\r\n    constructor(config, module) {\r\n        this.module = module;\r\n        this.dfSites = config.dfSites;\r\n        this.nSites = config.dfSites.length;\r\n\r\n        this.siteCoordsPtr = this.module._malloc(2*this.nSites*64);\r\n        this.siteLocations = new Float64Array(this.module.HEAPU8.buffer, this.siteCoordsPtr, 2*this.nSites);\r\n\r\n        this.siteLocations.set(this.dfSites.reduce((res, site) => {\r\n            res = [...res, ...[site.lon, site.lat]];\r\n            return res;\r\n        }, []));\r\n\r\n        console.log(this.siteLocations);\r\n\r\n        this.bearingsPtr = this.module._malloc(2*this.nSites*64);\r\n        this.bearings = new Float64Array(this.module.HEAPU8.buffer, this.bearingsPtr, 2*this.nSites);\r\n    }\r\n\r\n    getBearings(lon, lat) {\r\n        return this.dfSites.map(s => {\r\n            return this.module.getBearing(s.lon, s.lat, lon, lat);\r\n        });\r\n    }\r\n\r\n    getFixEstimate(bearings, sigmas, nEllipsePoints, nBearingLinePoints) {\r\n        this.ellipsePtr = this.module._malloc(2*nEllipsePoints*64);\r\n        const ellipse = new Float64Array(this.module.HEAPU8.buffer, this.ellipsePtr, 2*nEllipsePoints);\r\n\r\n        this.bearingLinesPtr = this.module._malloc(this.nSites*3*2*nBearingLinePoints*64);\r\n        const bearingLines = new Float64Array(this.module.HEAPU8.buffer, this.bearingLinesPtr, this.nSites*3*2*nBearingLinePoints);\r\n\r\n        this.bearings.set(bearings.concat(sigmas));\r\n\r\n        const data = this.module.getEllipse(this.nSites, this.siteCoordsPtr, this.bearingsPtr, nEllipsePoints, nBearingLinePoints, this.ellipsePtr, this.bearingLinesPtr);\r\n\r\n        return {\r\n            metaData: data,\r\n            ellipse: ellipse,\r\n            bearingLines: bearingLines,\r\n        }\r\n    }\r\n\r\n    resetBuffers() {\r\n        this.siteCoordsPtr = this.module._malloc(2*this.nSites*64);\r\n        this.siteLocations = new Float64Array(this.module.HEAPU8.buffer, this.siteCoordsPtr, 2*this.nSites);\r\n\r\n        this.bearingsPtr = this.module._malloc(2*this.nSites*64);\r\n        this.bearings = new Float64Array(this.module.HEAPU8.buffer, this.bearingsPtr, 2*this.nSites);\r\n    }\r\n\r\n    free() {\r\n        this.module._free(this.ellipsePtr);\r\n        this.module._free(this.bearingLinesPtr);\r\n    }\r\n\r\n};\r\n\r\nfunction loadModule(config) {\r\n    return new Promise(resolve => {\r\n        Promise.all(/*! import() */[__webpack_require__.e(0), __webpack_require__.e(1)]).then(__webpack_require__.t.bind(null, /*! ./wasm/bearing_wasm.js */ \"./src/wasm/bearing_wasm.js\", 7)).then(module => {\r\n            const mod = module.default({locateFile: (path, prefix) => {\r\n                    return `bearing_wasm.wasm`;\r\n                }});\r\n            mod.onRuntimeInitialized = () => {\r\n                resolve(new Bearing(config, mod));\r\n            }\r\n        });\r\n    })\r\n}\r\n\n\n//# sourceURL=webpack://wasm/./src/index.js?");

/***/ }),

/***/ "./src/wasm lazy recursive ^\\.\\/.*_wasm\\.js$":
/*!**********************************************************!*\
  !*** ./src/wasm lazy ^\.\/.*_wasm\.js$ namespace object ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var map = {\n\t\"./bearing_wasm.js\": [\n\t\t\"./src/wasm/bearing_wasm.js\",\n\t\t0,\n\t\t1\n\t],\n\t\"./fft_wasm.js\": [\n\t\t\"./src/wasm/fft_wasm.js\",\n\t\t0,\n\t\t2\n\t]\n};\nfunction webpackAsyncContext(req) {\n\tif(!__webpack_require__.o(map, req)) {\n\t\treturn Promise.resolve().then(function() {\n\t\t\tvar e = new Error(\"Cannot find module '\" + req + \"'\");\n\t\t\te.code = 'MODULE_NOT_FOUND';\n\t\t\tthrow e;\n\t\t});\n\t}\n\n\tvar ids = map[req], id = ids[0];\n\treturn Promise.all(ids.slice(1).map(__webpack_require__.e)).then(function() {\n\t\treturn __webpack_require__.t(id, 7);\n\t});\n}\nwebpackAsyncContext.keys = function webpackAsyncContextKeys() {\n\treturn Object.keys(map);\n};\nwebpackAsyncContext.id = \"./src/wasm lazy recursive ^\\\\.\\\\/.*_wasm\\\\.js$\";\nmodule.exports = webpackAsyncContext;\n\n//# sourceURL=webpack://wasm/./src/wasm_lazy_^\\.\\/.*_wasm\\.js$_namespace_object?");

/***/ })

/******/ });
});