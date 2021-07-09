import vm from "isolated-vm";

/**
 * @typedef {Object} VMArgs
 * @property {number} memoryLimit
 * @property {number} timeout
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
 * @param {{ memoryLimit : !Number, timeout : !Number}} options
 * @returns {[Object?, Error?]}
 */
export default async function (cloudFunc, args, vmArgs) {
  let job = new vm.Isolate({ memoryLimit: vmArgs.memoryLimit });
  let ctx = await job.createContext();

  ctx.global.setSync("global", ctx.global.derefInto());
  ctx.global.setSync("log", (out) => {
    console.log(out);
  });
  // ctx.global.setSync("axios", axios);
  let script = await job.compileModule(cloudFunc, { filename: "function.js" });
  try {
    await script.instantiate(ctx, () => {});
    await script.evaluate({ promise: true, timeout: vmArgs.timeout });
    let func = await script.namespace.get("default");
    console.log(func);
    try{
      return [await new Promise((resolve, reject) =>
        func.apply(undefined, [...args, new vm.Callback(resolve), new vm.Callback(reject)])
      ), null]
    }catch (e){
      job.dispose();
      return [null, e]
    }
  } catch (e) {
    job.dispose();
    return [null, e]
  }
}
