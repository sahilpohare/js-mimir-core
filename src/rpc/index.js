import computeEngine from "../compute-engine/index.js";
import ipfs from "../bundles/ipfsBundle.js";

/**
 * @typedef MimirRequest
 * @property {string} funtionImage
 * @property {import("libp2p/src/peer-routing").PeerId} requestAgent
 * @property {object} body
 * @property {Map<string,string>} headers
 */

/**
 * @typedef MimirResponse
 * @property {string} outputHash
 * @property {import("libp2p/src/peer-routing").PeerId} responseAgent
 * @property {object} body
 * @property {Map<string,string>} headers
 * @property {number} statusCode
 */

/** 
 * @param {MimirRequest} request
 * @returns {MimirResponse}
*/
// export async function handleRequest(request) {
//   console.log("Handl",this)
//   // console.trace("PEERID", this.peerId.toB58String())
//   //Download Function From Ipfs
//   const source = ipfs.cat(request.funtionImage);
//   let func = "";
//   const decoder = new TextDecoder("utf-8");

//   for await (const chunk of source) {
//     func += decoder.decode(chunk, {
//       stream: true,
//     });
//   }

//   //Pass in Compute Engine 
//   let [out, err] = await computeEngine(func, [request], {memoryLimit : 100, timeout : 100});
//   if (err){
//     return {
//      // responseAgent : node.peerId.toB58String(),
//       statusCode : 500,
//       outputHash : ""
//     }
//   }

//   return {
//     statusCode : 200,
//     // responseAgent : this.peerId.toB58String(),
//     body : out
//   }
// }
