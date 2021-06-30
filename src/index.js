import Libp2p from "libp2p";
import ipfsBundle from "./bundles/ipfsBundle.js";
import libp2pConfig, { createNode, initNode } from "./bundles/libp2pBundle.js";
import './utils/interface.js'
import { initCli } from "./utils/interface.js";


const protocol = '/mimir/0.0.1a'

class Mimir{
  /**@type {Libp2p} */
  node
  /**@type {import("libp2p/src/").Libp2pConfig} */
  #config;

  rpcDialer;

  constructor (config = libp2pConfig){
    this.#config = config;
  }

  async start(){
    try{
      this.node = await Libp2p.create(this.#config);
      this.peerId = this.node.peerId;
      this.multiaddrs = this.node.multiaddrs;
      this._isStarted = this.node._isStarted;
      this.addresses = this.node.addresses;
      this.addrs = this.multiaddrs.map((ma)=>`${ma.toString()}/p2p/${this.node.peerId.toB58String()}`)
      this.pubsub = this.node.pubsub;
      
      this.dialHandleRequest = await createNode(this.node);
      this.stop = this.node.stop;

      return this.dialHandleRequest;
    } catch(e){
      throw new Error(e, "Error Starting Node");
    }
  }
  
  async stop(){
    return await this.node.stop();
  }
  // async create(params) {
  //   try{
  //     this._node = await createNode();
  //     this._ipfs = ipfsBundle
  //   } catch (e){
  //     throw e;
  //   }
  // }

  async createTask(){
  }

  // async compute(){
  //   return this._node
  // }
}
// try {
//   let node = await createNode()
//   // const node = await Libp2p.create(libp2pConfig);
//   // // node.handle('/p2p/mimirCloud/0.0.1a', )
 
//   // await node.start()
//   // await initNode(node)
//   // //global.mimirNode = node;
//   // initCli(node)
//   // console.log('Started Node', node.peerId.toB58String() ,node.multiaddrs);
// } catch (e) {
//   throw e;
// }

export default Mimir;
