import {ucfirst, lcfirst} from "../../base/helper/StrHelper.mjs";
import BootstarpService from "../../base/service/BootstarpService.mjs";


class AbstractDispatcher{

    //http://caibaojian.com/es6/class.html
    //https://es6.ruanyifeng.com/#docs/class
    constructor() {
        if (new.target === AbstractDispatcher) {
          throw new Error('本类不能实例化');
        }
    }

    async dispatch(ctype, router, argv){

    }

    async importControllerFile(ctype, router, argv){
      const dispatcherFilePath = "app/" + router.app + "/" + lcfirst(ctype) + "controller/" + ucfirst(router.ctrl) + ucfirst(ctype) + "controller.mjs";
      return await BootstarpService.instance.ESMImportFromAppdir(dispatcherFilePath);
    }


}

export default AbstractDispatcher;