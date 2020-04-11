CPP_DIR=/tmp/tmp.d8rFPD1hLv;
BIN_DIR=${CPP_DIR}/cmake-build-debug-ubuntu
MODULE_NAME=bearing

buildWSL() {
  echo BUILDING "$1" ON WSL ... "$2";
  ls -al "$2"
  cd /tmp/tmp.jMANeMGRJk || return;
  make bearing_wasm_new CLION_EXE_DIR=cmake-build-debug-local-wsl;
  cp -v cmake-build-debug-local-wsl/bearing_wasm.js "$2"/../src/wasm
  cp -v cmake-build-debug-local-wsl/bearing_wasm.wasm "$2"/../dist
}

buildRemote() {
  echo BUILDING "$3" REMOTE ON "$1"@"$2"
  ssh -i ~/.ssh/id_rsa.emscripten emscripten@"$2" "cd ${CPP_DIR}; . utils/build.sh makeModule ${3}"
  scp -i ~/.ssh/id_rsa.emscripten emscripten@"$2":${BIN_DIR}/${MODULE_NAME}*.* .
  cp ${MODULE_NAME}_"${3}".js ./src/wasm/.
  mv ${MODULE_NAME}_"${3}".js ./dist/.
  mv ${MODULE_NAME}.wasm ./dist/.
  pwd
}

makeModule() {
  echo MAKING "$1"
  make ${MODULE_NAME}_"$1" CLION_EXE_DIR=${BIN_DIR}
}

"$@"