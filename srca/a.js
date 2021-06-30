const Libp2p = require('libp2p')
const Libp2p = require("libp2p");
const TCP = require("libp2p-tcp");
const MPlex = require("libp2p-mplex");
const { NOISE } = require("libp2p-noise");
const SECIO = require("libp2p-secio");
const WS = require("libp2p-websockets");
const Bootstrap = require("libp2p-bootstrap");
const MDNS = require("libp2p-mdns");
const process = require("process");
const KadDHT = require("libp2p-kad-dht");

(async () => {
let node = await Libp2p.create({
    addresses: {
      listen: ["/ip4/0.0.0.0/tcp/0", "/ip4/0.0.0.0/tcp/0/ws"],
    },
    modules: {
      dht: KadDHT,
      transport: [TCP, WS],
      streamMuxer: [MPlex],
      connEncryption: [NOISE, SECIO],
      peerDiscovery: [MDNS],
    },
    config: {
      peerDiscovery: {
        [MDNS.tag]: {
          enabled: true,
        },
      },
    },
  });

await node.start();



