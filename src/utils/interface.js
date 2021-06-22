 /** @type {Map<String,Function|Promise>}*/
 global.args = new Map();
 global.username = 'sahil'
 /**
  * @param {string} command
  * @param {(data : Array<string>) => void} handler
  */
export let defineCommand = (command, handler = async (data) => {}) => {
  global.args[command] = handler;
};

export function initCli(node){
  defineCommand("cls", console.clear);

  defineCommand("setusr", (data) => {
    username = data[0];
  });
  defineCommand("whoami", (data) => {
    console.log(username, node.peerId.toB58String());
  });

  defineCommand('')
}
process.stdin.on("data", (msg) => {
  let sliced = msg.slice(0, -1).toString();
  let arg = sliced.split(" ").map((m) => m.trim());
  let basearg = arg[0];
  let data = arg.slice(1);
  if (args[basearg] != null) {
    args[basearg](data);
    console.log(`${username || "urista"} >`);
    return;
  } else {
    console.log("invalid arg");
    console.log(`${username || "urista"} >`);
    return;
  }
});

