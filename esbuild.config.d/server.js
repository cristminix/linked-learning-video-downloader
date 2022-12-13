function getBuildOptions(isServe){
    let buildOptions = {
    entryPoints: getEntryPoints(),
    outdir: 'dist/js',
    bundle: true,
    tsconfig: 'src-ui/tsconfig.json',
    format: 'iife',
    sourcemap: true,
    plugins:[]
  }

  return buildOptions;
}
function getEntryPoints(){
    return [
        'src-server/src/server.ts'
    ];
}
export {getBuildOptions,getEntryPoints};