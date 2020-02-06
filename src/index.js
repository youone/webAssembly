// import('../cpp/cmake-build-debug-ubuntu/bindings.js').then(bindtest => {
//     import('../cpp/cmake-build-debug-ubuntu/bindings.wasm').then(mm => {
//         console.log(mm);
//     });
// });

// import bindtest from './wasm/bearing.js';
// import bindtestModule from './wasm/bearing.wasm';
//
// // const module = bindtest({locateFile(path) {if(path.endsWith('.wasm')) {return bindtestModule;} return path;}});
//
// console.log(bindtestModule);
//
// fetch(bindtestModule).then((mm) => {
//     console.log(mm);
// })
//

// import('./test.js');
// import('./test.wasm');
// import('../cpp/cmake-build-debug-ubuntu/main.wasm')
// // import('./add.wasm')
//     .then(module => {
//         console.log(module.add(3,5));
//     })


// fetch('./test.wasm').then(async (response) => {
//
//     let arrayBuffer = await response.arrayBuffer();
//
//
//     let wasmModule = await WebAssembly.instantiate(arrayBuffer, {});
//
//     console.log(wasmModule);
//
// })

const f = 5;

