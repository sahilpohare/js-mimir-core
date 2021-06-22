import Libp2p from "libp2p";
import libp2pConfig, { initNode } from "./bundles/libp2pBundle.js";
import './utils/interface.js'
import { initCli } from "./utils/interface.js";


const protocol = '/mimir/0.0.1a'
try {
  const node = await Libp2p.create(libp2pConfig);
  // node.handle('/p2p/mimirCloud/0.0.1a', )
 
  await node.start()
  await initNode(node)
  global.mimirNode = node;
  initCli(node)
  console.log('Started Node', node.peerId.toB58String() ,node.multiaddrs);
} catch (e) {
  throw e;
}
