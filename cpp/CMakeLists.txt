cmake_minimum_required(VERSION 3.10)
project(webAssembly)

set(CMAKE_CXX_STANDARD 14)
set(CMAKE_VERBOSE_MAKEFILE ON)

include_directories("/opt/emsdk/upstream/emscripten/system/include/")

add_custom_target(fft COMMAND make fft -C ${webAssembly_SOURCE_DIR} CLION_EXE_DIR=${PROJECT_BINARY_DIR})
add_custom_target(bearing COMMAND make bearing -C ${webAssembly_SOURCE_DIR} CLION_EXE_DIR=${PROJECT_BINARY_DIR})

add_library(main.cpp bearing.cpp)
