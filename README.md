# js-mimir-core
Mimir is a service that provides serverless function compute over IPFS and Libp2p.

### Usage
```js
import Mimir from '@mimir/core';

const mimirCore = await Mimir.create({ authKey : "<AUTH_KEY>", appKey : "<APP-KEY>"});
await mimirCore.start();

let [out,err] = await mimirCore.request({ functionImage : "QmFunctionImage", body : { name : "" });
if(err){
  console.log(out)
}
```
