cmake_minimum_required(VERSION 3.10)
project(untitled3)

set(CMAKE_CXX_STANDARD 14)
set(CMAKE_VERBOSE_MAKEFILE ON)

include_directories("/home/emscripten/emsdk/fastcomp/emscripten/system/include")
include_directories("./fftw-3.3.8/api")

add_custom_target(mytest COMMAND make -C ${untitled3_SOURCE_DIR} CLION_EXE_DIR=${PROJECT_BINARY_DIR})

add_library(untitled3 main.cpp)
