all:
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