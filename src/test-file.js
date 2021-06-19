import vm from "isolated-vm";

import axios from "axios";

(async function () {
  let job = new vm.Isolate({ memoryLimit: 128 });
  let ctx = await job.createContext();

  ctx.global.setSync("global", ctx.global.derefInto());

  ctx.global.setSync("log", (out) => {
    console.log(out);
  });

  ctx.global.setSync("axios", axios, {reference : true});
  let script = await job.compileModule(
    `export default async function(req){ 
        let res = await axios.get('www.google.com') 
        return res
    }`,
    { filename: "function.js" }
  );
  try {
    await script.instantiate(ctx, () => {});
    await script.evaluate({promise : true});
    let func = await script.namespace.get('default', {reference : true});
    console.log(func)
    
    let result = await func.apply(undefined, [{foo:10}], {result : {promise : true}});
    console.log(result)
  } catch (e) {
    console.log(e);
  }
})();
