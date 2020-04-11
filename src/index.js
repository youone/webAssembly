import bearingModule from './wasm/bearing_wasm.js';
// import bearingAsmModule from './wasm/bearing_asm.js';

const module = bearingModule({locateFile: (path, prefix) => {
        return 'bearing_wasm.wasm';
    }});

// const asmModule = bearingAsmModule();
// console.log(asmModule.getBearing(60,40,60,40.001))

module.onRuntimeInitialized = () => {
    console.log(module.getBearing(60,40,60,40.001))
}
