import computeEngine from '../src/compute-engine/index.js';
import taskSender from '../src/taskSenderAgent/index.js';

import assert from 'assert';
import { handleRequest } from '../src/rpc/index.js';
import { createNode } from '../src/bundles/libp2pBundle.js';

describe('Tests Compute Engine',()=>{
    it('Checks Compute Engine',async ()=>{
        let [out, err] = await computeEngine(`
            export default function(req, res, rej){
                res(req + 1)
            }
            `, ['sahil'], {memoryLimit : 100, timeout : 100});
         
        assert.strictEqual(out,'sahil1')
    })
});

describe('Tests IPFS Getter',async ()=>{
    it('Checks IPFS upload',async ()=>{
        let [cid, err] = await taskSender('./tests/exampleproject/index.js');
        if(err){
            assert.fail("error")
        }
        assert.strictEqual(cid, 'QmQMPtKR9ikiC8z1FJguPxwgaKmdnkPgBaR4a4PQrf4hxN')
    });
});

describe('Request Handling',async ()=>{
    it('Checks Request Handling Mock',async ()=>{
        let [cid, err] = await taskSender('./tests/exampleproject/index.js');
        if(err){
            assert.fail("error")
        }
        assert.strictEqual(cid, 'QmQMPtKR9ikiC8z1FJguPxwgaKmdnkPgBaR4a4PQrf4hxN');
        let peer = await createNode();
        let res = await handleRequest({
            body : { name : "Sahil"},
            requestAgent : peer.peerId.toB58String(),
            funtionImage : cid
        }, peer);

        assert.strictEqual(res.body, 'Sahilchecked');
        assert.strictEqual(res.statusCode, 200);
        await peer.stop();
    });
});