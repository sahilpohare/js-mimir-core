import Libp2p from "libp2p";
import computeEngine from "./compute-engine/index.js";
import ipfs from "./bundles/ipfsBundle.js";
import libp2pConfig, { initNode } from "./bundles/libp2pBundle.js";
import { PROTOCOL } from "./constants/index.js";
import PeerID from "peer-id";
import "./utils/interface.js";
import { initCli } from "./utils/interface.js";
import { create as createRpc } from "./bundles/rpcBundle.js";

export const protocol = "/mimir/0.0.1a";

/**@type {MimirRpcConfig} */

class Mimir extends Libp2p {
  /**@type {import("libp2p/src/").Libp2pConfig} */
  #config;

  /**@type {import('znode')}*/
  dialRPC;

  constructor(_options) {
    super(_options);
  }

  /**@type {import("libp2p/src/").Libp2pConfig} */
  static async create(options = libp2pConfig) {
    if (options.peerId) {
      return new Mimir(options);
    }

    const peerId = await PeerID.create();

    options.peerId = peerId;
    let node = new Mimir(options);
    let rpcObj = {
      /** @param {import("./rpc/index.js").MimirRequest} request */
      handleRequest: async (request) => {
        console.log(
          `[${new Date().toLocaleTimeString()}] Request for function/${request.funtionImage} by ${request.requestAgent}`
        );
        return node.handleRequest(request);
      },
      test: async () => {
        console.log("Recieved RPC");
        return "Hello";
      },
    };
    try {
      node.dialRPC = await createRpc(node, rpcObj, PROTOCOL);
    } catch {
      console.log("FAILED TO CREATE RPC");
    }
    return node;
  }

  async start() {
    try {
      await super.start();
      initNode(this);
      console.log(
        "Started Node",
        this.multiaddrs.map((ma) => `${ma}/p2p/${this.peerId.toB58String()}`)
      );

      initCli(this);

      return this.dialRPC;
    } catch (e) {
      throw new Error(e, "Error Starting Node");
    }
  }

  //TEST
  /**
   * @param {import('peer-id')|Multiaddr|string} peer - The peer to dial
   * @param {import("./rpc/index.js").MimirRequest request
   * */
  async sendComputeRequest(request, peer) {
    let rpc = await this.dialRPC(peer);
    return await rpc.handleRequest(request);
  }

  async createTask() {}

  /**
   * @param {import("./rpc/index.js").MimirRequest} request
   * @returns {import("./rpc/index.js").MimirResponse}
   */
  async handleRequest(request) {
    //Download Function From Ipfs
    const source = ipfs.cat(request.funtionImage);
    let func = "";
    const decoder = new TextDecoder("utf-8");

    for await (const chunk of source) {
      func += decoder.decode(chunk, {
        stream: true,
      });
    }

    //Pass in Compute Engine
    let [out, err] = await computeEngine(func, [request], {
      memoryLimit: 100,
      timeout: 100,
    });
    if (err) {
      return {
        // responseAgent : node.peerId.toB58String(),
        statusCode: 500,
        outputHash: "",
      };
    }

    return {
      statusCode: 200,
      responseAgent: this.peerId.toB58String(),
      body: out,
    };
  }
}

export default Mimir;
