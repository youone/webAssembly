const exports = {
    bearing: ['getBearing', 'getEllipse', '_malloc', 'HEAPU8', '_free'],
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
                console.log('MMMMMMMMMM', mod)
                const exportedFunctions = {};
                exports[moduleName].map(modName => {
                    exportedFunctions[modName] = mod[modName];
                });
                resolve(exportedFunctions);
            }
        });
    })
}

loadWasmModule('bearing').then(bearingMod => {
    console.log(bearingMod.getBearing(60,40,60,40.001));
})

loadWasmModule('fft').then(fftMod => {
    console.log(fftMod);
})
