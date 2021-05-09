 /** @type {Map<String,Function|Promise>}*/
 global.args = new Map();
 
 /**
  * @param {string} command
  * @param {(data : Array<string>) => void} handler
  */
let defineCommand = (command, handler = async (data) => {}) => {
  global.args[command] = handler;
};

module.exports = {
    defineCommand
}