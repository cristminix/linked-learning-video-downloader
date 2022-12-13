import * as child from 'child_process';

import { build } from 'esbuild';
import esbuildPluginBowserSync from 'esbuild-plugin-browser-sync';

import * as main from './esbuild.config.d/main.js';
import * as app from './esbuild.config.d/app.js';
import * as server from './esbuild.config.d/server.js';

const isServe = process.argv.includes('serve');
const isMain = process.argv.includes('main');
const isApp = process.argv.includes('app');
const isServer = process.argv.includes('server');

let buildOptions = {};
let entryPoints = [];
// if(isAll){
//   buildOptions = all.getBuildOptions();
// }else{
  
  if(isMain){
    buildOptions = {...main.getBuildOptions()};
    entryPoints = [...main.getEntryPoints()];
  }
  if(isApp){
    buildOptions = {...app.getBuildOptions()};
    entryPoints = [...app.getEntryPoints()];
  }
  if(isServer){
    buildOptions = {...server.getBuildOptions()};
    entryPoints = [...server.getEntryPoints()];
  }

  buildOptions.entryPoints = entryPoints;
// }
// buildOptions.outbase = 'src';
console.log(buildOptions)
if(isServe){
  buildOptions.watch = {
    onRebuild(error, result) {
      if (error){ 
        console.error('watch build failed:', error);
      }
      else {
        console.log('watch build succeeded:', result);
        onRebuild(error);
      }
    },
  };
  buildOptions.plugins.push(esbuildPluginBowserSync({
    server: 'dist'
  }))
}else{
  buildOptions.sourcemap = false;
  buildOptions.minify = true;
}
function onRebuild(r){
  const proc = child.exec('./tools/shell_scripts/play_and_reload.sh');
  // proc.on('exit', function (code, signal) {
  //   console.log('child process exited with ' + `code ${code} and signal ${signal}`);
  // });
  proc.stdout.on('data', (data) => {
    console.log(`\n${data}`);
  });
  
  // proc.stderr.on('data', (data) => {
  //   console.error(`child stderr:\n${data}`);
  // });
}
build(buildOptions).then((r)=>{
  console.log(r);
  onRebuild(r);
});

// console.log(buildOptions);
// console.log(all.getEntryPoints());