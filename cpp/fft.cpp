#include <stdio.h>
#include <fftw3.h>
#include <iostream>
#include <cmath>
#include <complex>
#include <emscripten/emscripten.h>

using namespace std;

#define REAL 0
#define IMAG 1

#ifdef __cplusplus
extern "C" {
#endif


double EMSCRIPTEN_KEEPALIVE process(float* data, int size, int nffts) {
    fftw_complex in[size];
    fftw_complex out[size];

    cout << "PROCESSING" << endl;

    float *ffts[nffts];

    for(int i = 0; i < nffts; i++) {
        ffts[i] = &data[i*size*2];
    }

    for(int i = 0; i < 2*size; i++) {
        cout << ffts[0][i] << " " << ffts[1][i] << " " << ffts[2][i] << endl;
    }

    return 99 * data[0];
}

int EMSCRIPTEN_KEEPALIVE myFunction(int data) {
    printf("MyFunction Called\n");
    int n = 5;
    fftw_complex x[n];
    fftw_complex y[n];

    for (int i = 0; i < n; i++) {
        x[i][REAL] = i+1;
        x[i][IMAG] = 0;
    }

    fftw_plan plan = fftw_plan_dft_1d(n,x,y,FFTW_FORWARD,FFTW_ESTIMATE);
    fftw_execute(plan);
    fftw_destroy_plan(plan);
    fftw_cleanup();

    cout << "FFT = " << endl;
    for (int i = 0; i < n; i++) {
        if(y[i][IMAG] < 0)
            cout << y[i][REAL] << " - " << abs(y[i][IMAG]) << "i" << endl;
        else
            cout << y[i][REAL] << " - " << y[i][IMAG] << "i" << endl;
    }

    cout << "HEEEJ" << endl;

    return data;
}

int main(int argc, char ** argv) {
}

#ifdef __cplusplus
}
#endif
