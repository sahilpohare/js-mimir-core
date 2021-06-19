const vm = require("isolated-vm");

/**
 * @typedef {Object} VMArgs
 * @property {number} memoryLimit 
 */

/**
 * @callback cloudFunctionCallback 
 * @param {Object} result
 */

/**
 * @param {!string} cloudFunc 
 * @param {any} args 
 * @param {cloudFunctionCallback} cb
 * @param {VMArgs} vmArgs
 * @param {{ memoryLimit : !Number}} options 
 * @returns {Object}
 */
export default async function(cloudFunc, args, cb, vmArgs){
  let job = new vm.Isolate({ memoryLimit: 128 });
  let ctx = await job.createContext();
  ctx.global.setSync("global", ctx.global.derefInto());
  ctx.global.setSync("log", (out) => {
    console.log(out);
  });
  ctx.global.setSync("axios", axios);
  let script = await job.compileModule(
    `export default async function(req, res){ log(req.hello) }`,
    { filename: "function.js" }
  );
  try {
    await script.instantiate(ctx, () => {});
    await script.evaluate({promise : true});
    let func = await script.namespace.get('default', {reference : true});
    console.log(func)
    
    await func.apply(undefined, [{hii : "Hii", hello : "hello"}], {result : {promise : true}})
  } catch (e) {
    console.log(e);
  }
}