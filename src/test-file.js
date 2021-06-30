import taskSender from '../src/taskSenderAgent/index.js';
import fs from 'fs'
import ipfs from "./bundles/ipfsBundle.js";
import { createNode } from './bundles/libp2pBundle.js';
import { handleRequest } from './rpc/index.js';

import Mimir from './index.js';

let mimirCore1 = new Mimir();

let mimirCore2 = new Mimir();
await mimirCore1.start();
// await mimirCore2.start();

console.log('mimirCore1', mimirCore1.node.multiaddrs.map(ma=>ma.toString()));
// console.log('mimirCore2', mimirCore2.node.multiaddrs);
// await mimirCore1.dialHandleRequest(mimirCore2.peerId)
// let [cid, err] = await taskSender('./exampleproject/index.js');
// console.log(cid,err)


// let [cid, err] = await taskSender('./tests/exampleproject/index.js');
// if(err){
//     // assert.fail("error")
// }
// // assert.strictEqual(cid, 'QmQMPtKR9ikiC8z1FJguPxwgaKmdnkPgBaR4a4PQrf4hxN');
// let peer = await createNode();
// // console.log(peer)
// console.log(await handleRequest({
//     body : {name : "Sahil"},
//     requestAgent : peer.peerId.toB58String(),
//     funtionImage : cid
// }, peer))