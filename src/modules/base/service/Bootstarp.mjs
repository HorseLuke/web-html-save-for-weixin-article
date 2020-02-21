// http://stackoverflow.com/a/26227662/1527470
//https://www.jianshu.com/p/f40a77bbd74e
// https://stackoverflow.com/questions/50268077/dirname-is-not-defined-in-node-js-10-experimental

const singletonEnforcer = Symbol();

/**
 * @var Bootstarp
 */
let _instance = null;

class Bootstarp{

    constructor(enforcer){
        if (enforcer !== singletonEnforcer) {
            throw new Error('Cannot construct singleton. Please use Bootstarp.instance');
        }
        this._init();
    }

    /**
     * @return _instance {Bootstarp} - Bootstarp单例
     */
    static get instance(){
        if(!_instance){
            _instance = new Bootstarp(singletonEnforcer);
        }

        return _instance;
    }

    _init(){
        this.appdir = "1";
    }

    setAppdir(dir){
        this.appdir = dir;
    }

    getAppdir(){
        return this.appdir;
    }

}

export default Bootstarp;