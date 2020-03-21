import { createRequire } from 'module';
import LoggerService from "../../logger/service/LoggerService.mjs";
import LoggerWriterStdout from "../../logger/writer/LoggerWriterStdout.mjs";
import * as Constants from "../helper/Constants.mjs";

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
     * 获取一个单例。
     * @return {BootstarpService} BootstarpService单例
     */
    static get instance(){
        if(!_instance){
            _instance = new BootstarpService(singletonEnforcer);
        }

        return _instance;
    }

    /**
     * 获取常量
     * @param {string} ref
     * @return {string|number} 
     */
    static getConstant(ref){
        return Constants[ref];
    }

    /**
     * （内部方法）初始化
     */
    _init(){
        this.appdir = "";
        this._initLogger();
    }

    /**
     * （内部方法）初始化Logger
     */
    _initLogger(){
        this.logger = new LoggerService();
        const stdout = new LoggerWriterStdout();
        stdout.setLevel(LoggerService.MSG_LEVEL_DEBUG);
        this.logger.setWriter("stdout", stdout);
    }

    /**
     * 获取logger
     * @return {LoggerService}
     */
    getLogger(){
        return this.logger;
    }

    /**
     * 设置appdir。
     * 该方法仅且只有设置一次，设置后请Object.freeze该BootstarpService单例。
     * @param {string} dir appdir
     */
    setAppdir(dir){
        this.appdir = dir;
    }

    /**
     * 获取appdir。
     * @return {string}
     */
    getAppdir(){
        return this.appdir;
    }

    /**
     * 检查ctype是否正确
     * @param {string} type type
     * @return {boolean}
     */
    checkCtype(ctype){
        const regex = /^[a-z][a-z0-9]{0,}$/i;
        if(!regex.test(ctype)){
            return false;
        }
        return true;
    }

    /**
     * 解析router字符串
     * @param {string} router 
     * @return {object}
     */
    parseRouter(router){
        const result = {
            "error": -1,
        };

        const regex = /^([a-z][a-z0-9\_]{0,})\/([a-z][a-z0-9\_]{0,})\/([a-z][a-z0-9\_]{0,})$/i;

        const regexResult = regex.exec(router);
        if(regexResult == null){
            return result;
        }

        result.error = 0;
        result.app = regexResult[1];
        result.ctrl = regexResult[2];
        result.action = regexResult[3];

        return result;

    }


    /**
     * 使用ES Module模块方式导入appdir目录下的文件（主要是.mjs文件）。
     * @param {string} filepath
     * @return {Promise}
     */
    ESMImportFromAppdir(filepath){
        return import("file://" + this.appdir + "/" + filepath);
    }

    /**
     * 使用Node.js的Common JS模块方式导入appdir目录下的文件（主要是.cjs文件）。
     * @see https://nodejs.org/api/esm.html#esm_differences_between_es_modules_and_commonjs
     * @param {string} filepath appdir目录下的文件路径
     * @return {any} exported module content
     */
    CJSRequireFromAppdir(filepath){
        const require = createRequire("file://" + this.appdir + "/");
        return require('./' + filepath);
    }

}

export default BootstarpService;