import computeEngine from "../compute-engine/index.js";
import ipfs from "../bundles/ipfsBundle.js";
import { createNode } from "../bundles/libp2pBundle.js";

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
 * @param {import("libp2p")} node The local host used to dial and make the
 * @returns {MimirResponse}
*/
export async function handleRequest(request, node) {
  const source = ipfs.cat(request.funtionImage);
  let contents = "";
  const decoder = new TextDecoder("utf-8");

  for await (const chunk of source) {
    contents += decoder.decode(chunk, {
      stream: true,
    });
  }
  console.log(contents);
  let puta = await computeEngine(contents, [request], {memoryLimit : 100, timeout : 100});
  console.log(puta);
  let [out, err] = puta;
  let response = {};

  if (err){
    return {
      responseAgent : node.peerId.toB58String(),
      statusCode : 500,
      outputHash : ""
    }
  }

  return {
    statusCode : 200,
    responseAgent : node.peerId.toB58String(),
    body : out
  }
}
