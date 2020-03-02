import CommonJsCompatHelper from "../helper/CommonJsCompatHelper.cjs";

// http://stackoverflow.com/a/26227662/1527470
// https://www.jianshu.com/p/f40a77bbd74e
// https://stackoverflow.com/questions/50268077/dirname-is-not-defined-in-node-js-10-experimental

const singletonEnforcer = Symbol();

/**
 * @var {BootstarpService}
 */
let _instance = null;

/**
 * 全局底层启动器。
 * 运行周期中，有且只有一个实例。
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
     * @return {BootstarpService} BootstarpService单例
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

    /**
     * 设置appdir。
     * 该方法仅且只有设置一次，设置后请Object.freeze该BootstarpService单例
     * @param {string} dir appdir
     */
    setAppdir(dir){
        this.appdir = dir;
    }

    /**
     * 获取appdir
     * @return {string}
     */
    getAppdir(){
        return this.appdir;
    }

    /**
     * 使用ES Module模块方式导入appdir目录下的文件（主要是.mjs文件）
     * @param {string} filepath
     * @return {Promise}
     */
    ESMImportFromAppdir(filepath){
        return import("file://" + this.appdir + "/" + filepath);
    }

    /**
     * 使用Node.js的Common JS模块方式导入appdir目录下的文件（主要是.cjs文件）
     * @param {string} filepath appdir目录下的文件路径
     * @return {any} exported module content
     */
    CJSRequireFromAppdir(filepath){
        return CommonJsCompatHelper.require(this.appdir + "/" + filepath);
    }

}

export default BootstarpService;