#include <iostream>
#include <emscripten/emscripten.h>
#include <fftw3.h>

using namespace std;

#ifdef __cplusplus
extern "C" {
#endif

double EMSCRIPTEN_KEEPALIVE process(float* data, int size, int nffts) {
    cout << "PROCESSING" << endl;
    return 5.0;
}

int main(int argc, char ** argv) {
    fftw_complex in[10];
    cout << "PROCESSAR" << endl;
}

#ifdef __cplusplus
}
#endif
