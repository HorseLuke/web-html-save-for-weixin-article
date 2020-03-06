/**
 * 限制运行时间器
 */
class LimitRunTimerService{


    /**
     * 对已实例化的对象，附加limitRunTimerServiceInstance属性，
     * 值为new LimitRunTimerService()
     * 
     * @example
     * //初始化一个对象，然后附加
     * const objExample = new Object();
     * LimitRunTimerService.attachNewToInstance(objExample);
     * objExample.limitRunTimerServiceInstance.onReachEndtimeEvent = () => {
     *     console.log("console");
     * }
     * objExample.limitRunTimerServiceInstance.keepAliveTime = 1000;    //1秒后运行
     * @param {object} obj 
     */
    static attachNewToInstance(obj){
        if(obj.hasOwnProperty("limitRunTimerServiceInstance")){
            obj.limitRunTimerServiceInstance.clear(true);
        }
        obj.limitRunTimerServiceInstance = null;
        obj.limitRunTimerServiceInstance = new LimitRunTimerService();
    }


    static attachDefinitionToClassDefinition(baseClass){

        return class extends baseClass{

            constructor(...args){
                super(...args);
                this.limitRunTimerServiceInstance = new LimitRunTimerService();
            }

        }

    }

    constructor(){
        this._keepAliveTime = 0;
        this._startTime = new Date();
        this._keepAliveTimeoutHandler = null;
        this._onReachEndtimeEventFunction = null;
    }

    /**
     * 设置运行超时时间（毫秒）
     * @param timeout int 0表示永远不超时，一直运行
     */
    set keepAliveTime(milsec){
        
        this.clearKeepAliveTimeoutHandler();

        this._keepAliveTime = milsec;
        this._startTime = null;
        this._startTime = new Date();

        if(milsec > 0){
            this._keepAliveTimeoutHandler = setTimeout(async() => {
                await this.runReachEndtime();
            }, milsec);
        }
    }

    get keepAliveTime(){
        return this._keepAliveTime;
    }

    get startTime(){
        return this._startTime;
    }

    /**
     * 设置运行超时后的处理措施
     */
    set onReachEndtimeEvent(func){
        if(func == null){
            this._onReachEndtimeEventFunction = null;
            return ;
        }

        if(!func instanceof Function){
            throw new Error("Pass is NOT Function");
        }

        this._onReachEndtimeEventFunction = func;
    }

    get onReachEndtimeEvent(){
        return null;
    }


    /**
     * 清除限制
     * @param {Boolean} clearWithAllEvent 是否同时清除运行超时后的处理措施？默认true
     */
    clear(clearWithAllEvent){
        
        clearWithAllEvent = clearWithAllEvent || true;

        if(clearWithAllEvent == true && this._onReachEndtimeEventFunction instanceof Function){
            this._onReachEndtimeEventFunction = null;
        }

        this.clearKeepAliveTimeoutHandler();
        this._keepAliveTime = 0;
        this._startTime = null;
        this._startTime = new Date();
    }


    clearKeepAliveTimeoutHandler(){
        if(this._keepAliveTimeoutHandler != null){
            clearTimeout(this._keepAliveTimeoutHandler);
        }
        this._keepAliveTimeoutHandler = null;
    }

    /**
     * @return <Promise>
     */
    async runReachEndtime(){

        this.clearKeepAliveTimeoutHandler();

        try{
            if(this._onReachEndtimeEventFunction instanceof Function){
                let res = this._onReachEndtimeEventFunction.apply(this);
                if(res instanceof Promise){
                    await res;
                }
            }
        }catch(e){
            console.log(e);
            return -1;
        }

        return 0;
    }



}

export default LimitRunTimerService;