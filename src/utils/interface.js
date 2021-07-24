import { Multiaddr } from "multiaddr";
import { PROTOCOL } from "../constants/index.js";
import taskSenderAgent from "../taskSenderAgent/index.js";
import CID from "cids";

/** @type {Map<String,Function|Promise>}*/
global.args = new Map();
global.username = "sahil";
/**
 * @param {string} command
 * @param {(data : Array<string>) => void} handler
 */
export let defineCommand = (command, handler = async (data) => {}) => {
  global.args[command] = handler;
};

/**@param {import('../index.js').default} mimirInstance*/
export function initCli(mimirInstance) {
  defineCommand("cls", console.clear);

  defineCommand("setusr", (data) => {
    username = data[0];
  });
  defineCommand("whoami", (data) => {
    console.log(username, mimirInstance.peerId.toB58String());
    console.log(username, mimirInstance.peerStore.peers);
  });
  defineCommand("findProviders", async (data) => {
    console.log(username);
    try {
      for await (const i of mimirInstance.contentRouting.findProviders(
          new CID("Qmar6yeEfybAqPyr9a4hjjSm5RDR7XCVhji2MAamB6DDAS"),
          { maxNumProviders: 5, timeout: 100 }
        )
      )
      
      {
        console.log(i.multiaddrs[0], i.id.toB58String());
      }
    } catch (e) {
      console.log(e);
    }
  });

  defineCommand("testRPC", async (data) => {
    // let rpc = await mimirInstance.dialRPC(data[0]);
    let [functionImage, error] = await taskSenderAgent(
      "./tests/exampleproject/index.js"
    );
    if (error) {
      console.log("error", error);
      return;
    }
    // rpc.handleRequest({
    //   functionImage : functionImage,
    //   body : { name : "Sahil"},
    //   requestAgent : mimirInstance.peerId.toB58String()
    // });
    // .sendComputeRequest(
    //   {
    //     body: { name: "Sahil" },
    //     requestAgent: instances[0].peerId.toB58String(),
    //     funtionImage: "QmSFi6cKPB5nfP98Kp4csqDWqoPq9n8KXkTZ19V4VE6g7U",
    //   },
    //   `${instances[1].multiaddrs[0]}/p2p/${instances[1].peerId.toB58String()}`
    // );
    console.log(
      await mimirInstance.request(
        {
          body: { name: "Sahil" },
          funtionImage: functionImage,
        },
        data[0]
      )
    );
  });

  defineCommand("listpeers", (data) => {
    mimirInstance.peerStore.peers.forEach((p) => {
      if (p.protocols.includes(PROTOCOL)) console.log(p.id.toB58String());
    });
  });
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
}
