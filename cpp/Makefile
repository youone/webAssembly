bearing_DEPS = bearing.cpp /root/GeographicLib-1.50.1/src/.libs/libGeographic.a /root/fftw-3.3.8/.libs/libfftw3.a
fft_DEPS = fft.cpp /root/fftw-3.3.8/.libs/libfftw3.a

USE_WASM=0
ifeq ($(ASM_TYPE), wasm)
  USE_WASM=1
endif

module:
	/opt/emsdk/upstream/emscripten/emcc --bind -O3 \
	-I/usr/local/include/ \
	-I/usr/local/include/eigen3 \
	-s WASM=$(USE_WASM) \
	--memory-init-file 0 \
	-s ALLOW_MEMORY_GROWTH=1 \
	-s EXTRA_EXPORTED_RUNTIME_METHODS="['ccall', 'cwrap']" \
	-s MODULARIZE=1 \
	-s EXPORT_NAME="'$(MODULE_NAME)Module'" \
	-o $(CLION_EXE_DIR)/$(MODULE_NAME)_$(ASM_TYPE).js \
	$($(MODULE_NAME)_DEPS)
