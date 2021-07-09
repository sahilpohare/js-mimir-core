import taskSender from '../src/taskSenderAgent/index.js';
import fs from 'fs'
import ipfs from "./bundles/ipfsBundle.js";
import { handleRequest } from './rpc/index.js';

import Mimir from './index.js';

let mimirCore1 = await Mimir.create();
await mimirCore1.start();