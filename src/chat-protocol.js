const pipe = require("it-pipe");

const PROTOCOL = "/libp2p/urista01/0.0.1";

/**
 *
 * @param {Buffer | string} stream
 */
async function handler({connection, stream }) {
  try {
    await pipe(stream, async (src) => {
      for await (const msg of src) {
        let data = JSON.parse(msg);
        console.info(
          `${data.name} : ${data.message}`
        );
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
async function send(msg, stream) {
  try {
    await pipe([msg], stream, async function (src) {
      for await (const msg of src) {
        console.log("HII");
        console.log(`Me : ${String(msg)}`);
      }
    });
  } catch (err) {
    console.error(err);
  }
}

module.exports = {handler , send}
