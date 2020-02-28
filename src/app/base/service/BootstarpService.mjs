import CommonJsCompatHelper from "../helper/CommonJsCompatHelper.cjs";

// http://stackoverflow.com/a/26227662/1527470
// https://www.jianshu.com/p/f40a77bbd74e
// https://stackoverflow.com/questions/50268077/dirname-is-not-defined-in-node-js-10-experimental

const singletonEnforcer = Symbol();

/**
 * @var BootstarpService
 */
let _instance = null;

/**
 * 全局底层启动器，运行周期中，有且只有一个实例。
 */
class BootstarpService{

    constructor(enforcer){
        if (enforcer !== singletonEnforcer) {
            throw new Error('Cannot construct singleton. Please use Bootstarp.instance');
        }
        this._init();
    }

    /**
     * 获取一个单例
     * @return _instance {BootstarpService} - BootstarpService
     */
    static get instance(){
        if(!_instance){
            _instance = new BootstarpService(singletonEnforcer);
        }

        return _instance;
    }

    _init(){
        this.appdir = "";
    }

    setAppdir(dir){
        this.appdir = dir;
    }

    getAppdir(){
        return this.appdir;
    }

    ESMImportFromAppdir(filepath){
        return import("file://" + this.appdir + "/" + filepath);
    }

    CJSRequireFromAppdir(filepath){
        return CommonJsCompatHelper.require(this.appdir + "/" + filepath);
    }

}

export default BootstarpService;