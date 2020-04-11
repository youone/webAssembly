ECHO off

set fullPath=%cd:~3%
C:\Users\johan\wsl\UbuntuWASM\UbuntuWASM run "utils/build.sh buildWSL %1 '/mnt/c/%fullPath:\=/%'"

REM bash -l -c './build.sh buildRemote emscripten 192.168.1.80 %1'
REM c:\cygwin\bin\bash -c 'cpp/utils/build.sh emscripten 192.168.1.80 %1'
