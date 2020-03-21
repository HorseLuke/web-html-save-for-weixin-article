import AbstractDispatcher from "../base/AbstractDispatcher.mjs";
import {ucfirst, lcfirst} from "../../base/helper/StrHelper.mjs";
import BootstarpService from "../../base/service/BootstarpService.mjs";

class Dispatcher extends AbstractDispatcher{

    //http://caibaojian.com/es6/class.html
    //https://es6.ruanyifeng.com/#docs/class
    constructor() {
        super();
    }

    async dispatch(ctype, router, argv){

        try{

            const ctrlfile = await this.importControllerFile(ctype, router, argv);
            const ctrl = new ctrlfile.default();
    
            const method = "action" + ucfirst(router.action);
    
            if(typeof ctrl[method] != "function"){
                throw new Error("Can not find method " + method + " in controller");
            }
    
            const result = await ctrl[method](argv);
    
            console.log(result);
    
        }catch(e){

            BootstarpService.instance.getLogger().log(
                BootstarpService.getConstant("MSG_LEVEL_ERR"),
                "cli dispatch error",
                e
            );
            
        }

    }


}

export default Dispatcher;