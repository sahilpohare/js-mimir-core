const fs = require("fs");
const { mainModule } = require("process");
const { defineCommand } = require("./interface");
const {ipfs} = require('./ipfs-handler');
const vm = require("isolated-vm");

/**
 * @param {String} scriptHash
 * @param {Array} data
 */

async function initVM() {
  global.ipfs = ipfs;
}

async function runTask(scriptHash, data) {
  const source = ipfs.cat(scriptHash);
  let contents = "";
  const decoder = new TextDecoder("utf-8");

  for await (const chunk of source) {
    contents += decoder.decode(chunk, {
      stream: true,
    });
  }

  contents += decoder.decode();
  console.log('running script',scriptHash);
  
  let isolate = new vm.Isolate({
    memoryLimit : 128
  });

  let context = await isolate.createContext();

  context.global.setSync('log', function(...args) {
    console.log(scriptHash,':',...args);
  });

  let script = await isolate.compileScript(contents);

  await script.run(context);
  let fnReference = await context.global.get("func");
  let output = await fnReference.apply(undefined, [1,data]);
  
  isolate.dispose();
}
async function addTask(scriptPath) {
  fs.readFile("./srca/functions/vm-functions.js", "utf8", async (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    let { cid } = await global.ipfs.add(data);
    console.log(`Script added on ${cid}`);
  });
  //TODO: Add Round Robin Scheduling, And bro please complete kario
}

module.exports = {
  initVM,
  runTask,
  addTask,
};
