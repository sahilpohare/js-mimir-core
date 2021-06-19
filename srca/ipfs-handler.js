const IPFS = require("ipfs-http-client");
module.exports.ipfs = IPFS({ host: "localhost", port: "5001", protocol: "http" });
