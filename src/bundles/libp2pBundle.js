import Libp2p from "libp2p";
import TCP from "libp2p-tcp";
import MPlex from "libp2p-mplex";
import { NOISE } from "libp2p-noise";
import SECIO from "libp2p-secio";
import WS from "libp2p-websockets";
import Bootstrap from "libp2p-bootstrap";
import MDNS from "libp2p-mdns";
import KadDHT from "libp2p-kad-dht";
import Gossipsub from 'libp2p-gossipsub';
import FloodSub from 'libp2p-floodsub';

let bootstrapers = [
  "/ip4/104.131.131.82/tcp/4001/p2p/QmaCpDMGvV2BGHeYERUEnRQAwe3N8SzbUtfsmvsqQLuvuJ",
  "/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN",
  "/dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb",
  "/dnsaddr/bootstrap.libp2p.io/p2p/QmZa1sAxajnQjVM8WjWXoMbmPd7NsWhfKsPkErzpm9wGkp",
  "/dnsaddr/bootstrap.libp2p.io/p2p/QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa",
  "/dnsaddr/bootstrap.libp2p.io/p2p/QmcZf59bWwK5XFi76CZX8cbJ4BhTzzA3gU1ZjYZcYW3dwt",
];
/**@type Libp2p.Libp2pOptions */
let libp2pConfig = {
  addresses: {
    listen: ["/ip4/0.0.0.0/tcp/0", "/ip4/0.0.0.0/tcp/0/ws"],
  },
  modules: {
    dht: KadDHT,
    transport: [TCP, WS],
    streamMuxer: [MPlex],
    connEncryption: [SECIO, NOISE],
    peerDiscovery: [MDNS],
    pubsub : Gossipsub
  },
  config: {
      
    dht: {
      enabled: true,
      kBucketSize: 20,
    },
    peerDiscovery: {
      [Bootstrap.tag]: {
        interval: 60e3,
        enabled: false,
        list: bootstrapers,
      },
      [MDNS.tag]: {
        enabled: true,
      },
    },
  },
};
console.log("AAAAAAAAAAAAA :",MDNS.tag)
export default libp2pConfig;
/**
 * @typedef MimirRpcConfig
 * @property handleRequestRpc}
 */

/**
 * @method
 * @name handleRequestRpc
 * @param {import("../rpc/index.js").MimirRequest} request
 * @returns {Promise<import("../rpc/index.js").MimirResponse>}
 */

/**@param {Libp2p} node */
export async function initNode(node) {
 
  node.connectionManager.on(
    "peer:connect",
    /**@param {import("libp2p/src/").Connection} connection */
    async function (connection) {
      // console.log(
      //   "Connection established to:",
      //   connection.remotePeer.toB58String()
      // );
    }
  );

  node.on(
    "peer:discovery",
    /**@param {import("libp2p/src/peer-routing").PeerId} peerId*/
    async (peerId) => {
      try{
        await node.dial(peerId);
        console.log("Dialed:", peerId.toB58String());
      }catch{
      }
    }
  );
}