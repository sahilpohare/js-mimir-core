import computeEngine from "../src/compute-engine/index.js";
import taskSender from "../src/taskSenderAgent/index.js";

import assert from "assert";
import Mimir from "../src/index.js";

describe("Tests Compute Engine", () => {
  it("Checks Compute Engine", async () => {
    let [out, err] = await computeEngine(
      `export default function(req, res, rej){
                res(req + 1)
            }
            `,
      ["sahil"],
      { memoryLimit: 100, timeout: 100 }
    );

    assert.strictEqual(out, "sahil1");
  });
});

describe("Tests IPFS Getter", async () => {
  it("Checks IPFS upload", async () => {
    let [cid, err] = await taskSender("./tests/exampleproject/index.js");
    if (err) {
      assert.fail("error");
    }
    assert.strictEqual(cid, "QmSFi6cKPB5nfP98Kp4csqDWqoPq9n8KXkTZ19V4VE6g7U");
  });
});

describe("RPC Test", async () => {
  it("Checks RPC", async () => {
    let instances = await Promise.all([Mimir.create(), Mimir.create()]);
    
    try {
      await instances[0].start();
      await instances[1].start();
    } catch {
      assert.fail("FAILED to start Instances");
    }

    let res = await instances[0].request(
      {
        body: { name: "Sahil" },
        requestAgent: instances[0].peerId.toB58String(),
        funtionImage: "QmSFi6cKPB5nfP98Kp4csqDWqoPq9n8KXkTZ19V4VE6g7U",
      },
      `${instances[1].multiaddrs[0]}/p2p/${instances[1].peerId.toB58String()}`
    );
    console.log(res)
    assert.strictEqual(res.body, "Sahilchecked");
    assert.strictEqual(res.statusCode, 200);
    assert.notStrictEqual(instances[0].peerId.toB58String, instances[1].peerId.toB58String());
    await Promise.all(instances.map((i) => i.stop()));
  });
});

describe("Request Handling", async () => {
  it("Checks Request Handling Mock", async () => {
    let [cid, err] = await taskSender("./tests/exampleproject/index.js");
    if (err) {
      assert.fail("error");
    }
    assert.strictEqual(cid, "QmSFi6cKPB5nfP98Kp4csqDWqoPq9n8KXkTZ19V4VE6g7U");

    let peer = await Mimir.create();
    let res = await peer.handleRequest({
      body: { name: "Sahil" },
      requestAgent: peer.peerId.toB58String(),
      funtionImage: cid,
    });

    console.log(res);
    assert.strictEqual(res.body, "Sahilchecked");
    assert.strictEqual(res.statusCode, 200);
    await peer.stop();
  });
});
