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
 */

/** @param {MimirRequest} request */
export async function compute(request) {
  const source = ipfs.cat(request.funtionImage);
  let contents = "";
  const decoder = new TextDecoder("utf-8");

  for await (const chunk of source) {
    contents += decoder.decode(chunk, {
      stream: true,
    });
  }
  console.log(contents);

  computeEngine(contents, request.body,)
}
