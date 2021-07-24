import Mimir from "./index.js";
import CID from 'cids';
let mimirCore1 = await Mimir.create();
await mimirCore1.start(true);

console.log("STARTING CONTENT ROUTING")
await mimirCore1.contentRouting.provide(
    new CID("Qmar6yeEfybAqPyr9a4hjjSm5RDR7XCVhji2MAamB6DDAS")
);

console.log("Provided CONTENT")
