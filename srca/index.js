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
const ChatProtocol = require("./chat-protocol.js");
console.clear();
const PROTOCOL = "/libp2p/uristaVM/0.0.1";
var username = process.argv[2];
const repl = require("repl");
const { initVM, runTask, addTask } = require("./compute-engine.js");
const { defineCommand } = require("./interface.js");

async function main() {
  const bootstrapers = [
    "/ip4/104.131.131.82/tcp/4001/p2p/QmaCpDMGvV2BGHeYERUEnRQAwe3N8SzbUtfsmvsqQLuvuJ",
    "/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN",
    "/dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb",
    "/dnsaddr/bootstrap.libp2p.io/p2p/QmZa1sAxajnQjVM8WjWXoMbmPd7NsWhfKsPkErzpm9wGkp",
    "/dnsaddr/bootstrap.libp2p.io/p2p/QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa",
    "/dnsaddr/bootstrap.libp2p.io/p2p/QmcZf59bWwK5XFi76CZX8cbJ4BhTzzA3gU1ZjYZcYW3dwt",
  ];
  const node = await Libp2p.create({
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
        // [Bootstrap.tag]: {
        //   interval: 60e3,
        //   enabled: true,
        //   list: bootstrapers,
        // },
        [MDNS.tag]: {
          enabled: true,
        },
      },
    },
  });
  await node.start();
  global.node = node; 
  await initVM();
  node.connectionManager.on("peer:connect", (connection) => {
    console.log(
      "Connection established to:",
      connection.remotePeer.toB58String()
    ); 
  });
  node.on("peer:discovery", (peerId) => {
    node.dial(peerId);
    // No need to dial, autoDial is on
    console.log("Discovered:", peerId.toB58String());
  });

  node.handle(PROTOCOL, ChatProtocol.handler);

  function sendmsg(msg) {
    node.peerStore.peers.forEach(async (peerData) => {
      if (!peerData.protocols.includes(PROTOCOL)) {
        // console.log("Peer Doesnt support Protocol")
        return;
      }
      const connection = node.connectionManager.get(peerData.id);
      if (!connection) return;

      try {
        const { stream } = await connection.newStream([PROTOCOL]);
        await ChatProtocol.send(
          JSON.stringify({ name: username, message: String(msg) }),
          stream
        );
      } catch (err) {
        console.error("failed to established a connection");
      }
    });
  }
  console.log(`${username || "urista"} >`);

  /**w@type {Map<String,Function|Promise>}*/
   global.args = new Map();

  console.log(global.ipfs)
 
  defineCommand("cls", console.clear);

  defineCommand("setusr", (data) => {
    username = data[0];
  });
  defineCommand("whoami", (data) => {
    console.log(username, node.peerId.toB58String());
  });
  defineCommand("listpeers", (data) => {
    node.peerStore.peers.forEach((p) => {
      if (p.protocols.includes(PROTOCOL)) console.log(p.id.toB58String());
    });
  });
  defineCommand("sendmsg", (data) => {
    sendmsg(data.join(" "));
  });

  defineCommand('addTask', async () => await addTask(data[0]));

  defineCommand('runTask', async () => await runTask(data[0],data[1]));


  defineCommand('print_ipfs', async () => addTask('./functions/vm-functions.js'));
  process.stdin.on("data", (msg) => {
    let sliced = msg.slice(0, -1).toString();
    arg = sliced.split(" ").map((m) => m.trim());
    let basearg = arg[0];
    data = arg.slice(1);
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

main();
