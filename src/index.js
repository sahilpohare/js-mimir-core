import Libp2p from "libp2p";
import libp2pConfig from './networking/libp2pBundle';


(async function () {
    try {
        const node = await Libp2p.create(libp2pConfig);
        node.handle('/p2p/mimirCloud/0.0.1a', )
    } catch (e){
        throw e;
    }
})();
