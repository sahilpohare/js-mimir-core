const Libp2p = require("libp2p");
const DelegatedPeerRouter = require("libp2p-delegated-peer-routing");
const DelegatedContentRouter = require("libp2p-delegated-content-routing");

const TCP = require("libp2p-tcp");
const MPlex = require("libp2p-mplex");
const { NOISE } = require("libp2p-noise");
const SECIO = require("libp2p-secio");
const WS = require("libp2p-websockets");
const Bootstrap = require("libp2p-bootstrap");
const MDNS = require("libp2p-mdns");
const process = require("process");
const KadDHT = require("libp2p-kad-dht");
const ChatProtocol = require("./chat-protocol.js");


const delegatedApiOptions = {
    protocol: 'https',
    port: 443,
    host: 'node0.delegate.ipfs.io'
  }

module.exports = new Libp2p({
  addresses: {
    listen: ["/ip4/0.0.0.0/tcp/0", "/ip4/0.0.0.0/tcp/0/ws"],
  },
  
  modules: {
    dht: KadDHT,
    transport: [TCP, WS],
    streamMuxer: [MPlex],
    connEncryption: [SECIO, NOISE],
    peerDiscovery: [MDNS],
    peerRouting: [
      new DelegatedPeerRouter({
        protocol: "https",
        port: 443,
        host: "node0.delegate.ipfs.io",
      }),
    ],
    contentRouting : [
        new DelegatedContentRouter()
    ]
  },
  config: {
    peerDiscovery: {
      [Bootstrap.tag]: {
        enabled: false,
        interval: 60e3,
        list: [
          "/ip4/104.131.131.82/tcp/4001/p2p/QmaCpDMGvV2BGHeYERUEnRQAwe3N8SzbUtfsmvsqQLuvuJ",
          "/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN",
          "/dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb",
          "/dnsaddr/bootstrap.libp2p.io/p2p/QmZa1sAxajnQjVM8WjWXoMbmPd7NsWhfKsPkErzpm9wGkp",
          "/dnsaddr/bootstrap.libp2p.io/p2p/QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa",
          "/dnsaddr/bootstrap.libp2p.io/p2p/QmcZf59bWwK5XFi76CZX8cbJ4BhTzzA3gU1ZjYZcYW3dwt",
        ],
      },
      [MDNS.tag]: {
        enabled: true,
      },
    },
  },
});