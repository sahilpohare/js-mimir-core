import vm from "isolated-vm";
// import axios from "axios";

import { compute } from "./rpc/index.js";

let job = new vm.Isolate({ memoryLimit: 128 });
let ctx = await job.createContext();
ctx.global.setSync("global", ctx.global.derefInto());
// ctx.global.setSync("log", (out) => {
//   console.log(out);
// });
// ctx.global.setSync("axios", axios);
// let script = await job.compileModule(
//   `export default async function(req){ log(req.hello) }`,
//   { filename: "function.js" }
// );
// try {
//   await script.instantiate(ctx, () => {});
//   await script.evaluate({promise : true});
//   let func = await script.namespace.get('default', {reference : true});
//   console.log(func)
  
//   await func.applySync(undefined,[{hello : 10}])
// } catch (e) {
//   console.log(e);
// }
ctx.global.setSync('log', function(...args) {
console.log('function',':',...args);
});
try{
  let script = await job.compileScript(`
    function cloudfunc(req,res){
      log(req);
      res('my res')
    }
  `);
  await script.run(ctx);
  let fnReference = await ctx.global.get("cloudfunc");
  new Promise((resolve)=>{
    fnReference.apply(undefined, [{name : 'sahil'}, new vm.Callback(resolve)])
  }).then(val=>console.log({'output' : val}))
}catch (e){
  console.log(e);
}



job.dispose();