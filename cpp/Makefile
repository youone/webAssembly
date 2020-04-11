bearing_wasm_new : bearing.cpp
	/opt/emsdk/upstream/emscripten/emcc --bind -O3 \
	-I/usr/local/include/ \
	-I/usr/local/include/eigen3 \
	-s WASM=1 \
	--memory-init-file 0 \
	-s ALLOW_MEMORY_GROWTH=1 \
	-s EXTRA_EXPORTED_RUNTIME_METHODS="['ccall', 'cwrap']" \
	-s MODULARIZE=1 \
	-s EXPORT_NAME="'bearingModule'" \
	-o $(CLION_EXE_DIR)/bearing_wasm.js \
	bearing.cpp /root/GeographicLib-1.50.1/src/.libs/libGeographic.a /root/fftw-3.3.8/.libs/libfftw3.a

bearing_wasm: bearing.cpp
	~/emsdk/fastcomp/emscripten/emcc --bind -O3 \
	-I./eigen-eigen-323c052e1731/ \
	-I./GeographicLib-1.49/include/ \
	-s WASM=1 \
	--memory-init-file 0 \
	-s ALLOW_MEMORY_GROWTH=1 \
	-s BINARYEN_TRAP_MODE='clamp' \
	-s EXTRA_EXPORTED_RUNTIME_METHODS="['ccall', 'cwrap']" \
	-s MODULARIZE=1 \
	-s EXPORT_NAME="'bearingModule'" \
	-o $(CLION_EXE_DIR)/bearing_wasm.js \
	bearing.cpp ./GeographicLib-1.49/src/Geodesic.cpp ./GeographicLib-1.49/src/Math.cpp ./GeographicLib-1.49/src/Geocentric.cpp ./GeographicLib-1.49/src/GeodesicLine.cpp

bearing_asm: bearing.cpp
	~/emsdk/fastcomp/emscripten/emcc --bind -O3 \
	-I./eigen-eigen-323c052e1731/ \
	-I./GeographicLib-1.49/include/ \
	-s WASM=0 \
	--memory-init-file 0 \
	-s ALLOW_MEMORY_GROWTH=1 \
	-s BINARYEN_TRAP_MODE='clamp' \
	-s EXTRA_EXPORTED_RUNTIME_METHODS="['ccall', 'cwrap']" \
	-s MODULARIZE=1 \
	-s EXPORT_NAME="'bearingModule'" \
	-o $(CLION_EXE_DIR)/bearing_asm.js \
	bearing.cpp ./GeographicLib-1.49/src/Geodesic.cpp ./GeographicLib-1.49/src/Math.cpp ./GeographicLib-1.49/src/Geocentric.cpp ./GeographicLib-1.49/src/GeodesicLine.cpp

fft:
	echo Compiling $(CLION_EXE_DIR)/$@ ...
	#/home/emscripten/emsdk/emsdk_env.sh;
	~/emsdk/fastcomp/emscripten/emcc -O3 \
										-I./fftw-3.3.8/api \
                                     	-s WASM=1 \
                                     	-s EXTRA_EXPORTED_RUNTIME_METHODS="['ccall', 'cwrap']" \
                                     	-s MODULARIZE=1 \
                                     	-s EXPORT_NAME="'TestModule'" \
                                     	-o $(CLION_EXE_DIR)/main.js \
                                     	main.cpp ./fftw-3.3.8/.libs/libfftw3.a
	chmod +x finish.sh;