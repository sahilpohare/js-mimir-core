![Frame 88 (2)](https://user-images.githubusercontent.com/19904237/167314855-d0a38f68-3697-4db4-b772-ecc0543ea216.png)
# js-mimir-core
Mimir is a service that provides serverless function compute over IPFS and Libp2p.
 

### Usage!
!NOT YET READY. JUST ON POC STAGE
```js
import Mimir from '@mimir/core';

const mimirCore = await Mimir.create({ authKey : "<AUTH_KEY>", appKey : "<APP-KEY>"});
await mimirCore.start();

let [out,err] = await mimirCore.request({ functionImage : "QmFunctionImage", body : { name : "" });
if(err){
  console.log(out)
}
```
