const pipe = require("it-pipe");
const { runTask } = require("./compute-engine");

const PROTOCOL = "/libp2p/uristaVM/0.0.1";

/**
 *
 * @param {Buffer | string} stream
 */
async function handler({connection, stream }) {
  try {
    await pipe(stream, async (src) => {
      for await (const msg of src) {
        let data = JSON.parse(msg);
        runTask(data.scriptHash, data.data);
      }
    });
  } catch (err) {
    console.log(err);
  }
}
/**
 *
 * @param {String | Buffer} msg
 * @param {PullStream} stream
 */
async function scheduleTask(msg, stream) {
  try {
    await pipe([msg], stream, async function (src) {
      for await (const msg of src) {
        console.log(`Me : ${String(msg)}`);
      }
    });
  } catch (err) {
    console.error(err);
  }
}

async function send(msg, stream) {
    try {
      await pipe([msg], stream, async function (src) {
        for await (const msg of src) {
          console.log(`Me : ${String(msg)}`);
        }
      });
    } catch (err) {
      console.error(err);
    }
  }

async function completeTask(msg, stream) {
    try {
        await pipe([msg], stream, async function (src) {
          for await (const msg of src) {
            console.log(`Me : ${String(msg)}`);
          }
        });
      } catch (err) {
        console.error(err);
      }
}

module.exports = {handler , send}
