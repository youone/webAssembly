const exports = {
    bearing: ['getBearing', 'getEllipse', '_malloc', 'HEAPU8', '_free', 'testFunc'],
    fft: []
};

export function loadWasmModule(moduleName) {
    return new Promise(resolve => {
        import(`./wasm/${moduleName}_wasm.js`).then(module => {
            const mod = module.default({locateFile: (path, prefix) => {
                    return `${moduleName}_wasm.wasm`;
                }});
            mod.onRuntimeInitialized = () => {

                // siteCoordsPtr = module._malloc(2*nSites*64);
                // siteLocations = new Float64Array(module.HEAPU8.buffer, siteCoordsPtr, 2*nSites);
                //
                // bearingsPtr = module._malloc(2*nSites*64);
                // bearings = new Float64Array(module.HEAPU8.buffer, bearingsPtr, 2*nSites);
                //
                const exportedFunctions = {};
                exports[moduleName].map(modName => {
                    exportedFunctions[modName] = mod[modName];
                });
                resolve(exportedFunctions);
            }
        });
    })
}

class Bearing {

    constructor(config, module) {
        this.module = module;
        this.dfSites = config.dfSites;
        this.nSites = config.dfSites.length;

        this.siteCoordsPtr = this.module._malloc(2*this.nSites*64);
        this.siteCoords = new Float64Array(this.module.HEAPU8.buffer, this.siteCoordsPtr, 2*this.nSites);

        this.bearingsPtr = this.module._malloc(2*this.nSites*64);
        this.bearings = new Float64Array(this.module.HEAPU8.buffer, this.bearingsPtr, 2*this.nSites);

        this.siteCoords.set(this.dfSites.reduce((res, site) => {
            res = [...res, ...[site.lon, site.lat]];
            return res;
        }, []));
    }

    getBearings(lon, lat) {
        return this.dfSites.map(s => {
            return this.module.getBearing(s.lon, s.lat, lon, lat);
        });
    }

    getFixEstimate(bearings, sigmas, nEllipsePoints, nBearingLinePoints) {
        this.ellipsePtr = this.module._malloc(2*nEllipsePoints*64);
        const ellipse = new Float64Array(this.module.HEAPU8.buffer, this.ellipsePtr, 2*nEllipsePoints);

        this.bearingLinesPtr = this.module._malloc(this.nSites*3*2*nBearingLinePoints*64);
        const bearingLines = new Float64Array(this.module.HEAPU8.buffer, this.bearingLinesPtr, this.nSites*3*2*nBearingLinePoints);

        this.bearings.set(bearings.concat(sigmas));

        let metaData;
        try {
            metaData = this.module.getEllipse(this.nSites, this.siteCoordsPtr, this.bearingsPtr, nEllipsePoints, nBearingLinePoints, this.ellipsePtr, this.bearingLinesPtr);
        }
        catch (e) {
            console.error(e);
        }

        return {metaData, ellipse, bearingLines}
    }

    resetBuffers() {
        this.siteCoordsPtr = this.module._malloc(2*this.nSites*64);
        this.siteCoords = new Float64Array(this.module.HEAPU8.buffer, this.siteCoordsPtr, 2*this.nSites);

        this.bearingsPtr = this.module._malloc(2*this.nSites*64);
        this.bearings = new Float64Array(this.module.HEAPU8.buffer, this.bearingsPtr, 2*this.nSites);
    }

    free() {
        this.module._free(this.ellipsePtr);
        this.module._free(this.bearingLinesPtr);
    }

};

export function loadModule(config) {
    return new Promise(resolve => {
        import(`./wasm/bearing_wasm.js`).then(module => {
            const mod = module.default({locateFile: (path, prefix) => {
                    return `bearing_wasm.wasm`;
                }});
            mod.onRuntimeInitialized = () => {
                resolve(new Bearing(config, mod));
            }
        });
    })
}
