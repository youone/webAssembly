const exports = {
    bearing: ['getBearing'],
    fft: []
};

function loadWasmModule(moduleName) {
    return new Promise(resolve => {
        import(`./wasm/${moduleName}_wasm.js`).then(module => {
            const mod = module.default({locateFile: (path, prefix) => {
                    return `${moduleName}_wasm.wasm`;
                }});
            mod.onRuntimeInitialized = () => {
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
