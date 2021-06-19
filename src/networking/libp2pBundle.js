import Libp2p from "libp2p";
import TCP from "libp2p-tcp";
import MPlex from "libp2p-mplex";
import { NOISE } from "libp2p-noise";
import SECIO from "libp2p-secio";
import WS from "libp2p-websockets";
import Bootstrap from "libp2p-bootstrap";
import MDNS from "libp2p-mdns";
import KadDHT from "libp2p-kad-dht";

let bootstrapers = [
  "/ip4/104.131.131.82/tcp/4001/p2p/QmaCpDMGvV2BGHeYERUEnRQAwe3N8SzbUtfsmvsqQLuvuJ",
  "/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN",
  "/dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb",
  "/dnsaddr/bootstrap.libp2p.io/p2p/QmZa1sAxajnQjVM8WjWXoMbmPd7NsWhfKsPkErzpm9wGkp",
  "/dnsaddr/bootstrap.libp2p.io/p2p/QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa",
  "/dnsaddr/bootstrap.libp2p.io/p2p/QmcZf59bWwK5XFi76CZX8cbJ4BhTzzA3gU1ZjYZcYW3dwt",
],

/**@type Libp2p.Libp2pOptions */
const node = {
  addresses: {
    listen: ["/ip4/0.0.0.0/tcp/0", "/ip4/0.0.0.0/tcp/0/ws"],
  },
  modules: {
    dht: KadDHT,
    transport: [TCP, WS],
    streamMuxer: [MPlex],
    connEncryption: [SECIO, NOISE],
    peerDiscovery: [MDNS],
  },
  config: {
    peerDiscovery: {
      [Bootstrap.tag]: {
        interval: 60e3,
        enabled: true,
        list: bootstrapers,
      },
      [MDNS.tag]: {
        enabled: true,
      },
    },
  },
};

export default node;