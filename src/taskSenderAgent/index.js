import ipfs from "../bundles/ipfsBundle.js";
import { promises as fs } from "fs";
import p from "path";
/**
 * @returns {[(import("libp2p/src/content-routing").CID)?, Error?]}
 */
export default async function (path) {
    try {
        let data = await fs.readFile(path, {encoding : "utf8", flag : 'r'});
        let { cid } = await ipfs.add(data);
        console.log(`Script added on ${cid}`);
        return [cid.toString(), null]
    } catch (e) {                         
        return [null, e]
    }
}

