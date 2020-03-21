import {MSG_LEVEL_EMERG} from "../../base/helper/Constants.mjs";

/**
 * 基础日志写入类。其余日志写入类必须继承该类
 */
class LoggerWriterDefault{

    constructor(){
        this.level = MSG_LEVEL_EMERG;
        this.index = 0;
    }

    setLevel(new_level){

        if(!Number.isInteger(new_level)){
            return this.level;
        }

        this.level = new_level;
        return this.level;
    }

    getLevel(){
        return this.level;
    }

    needLog(level){
        
        if(level > this.level){
            return false;
        }

        return true;
    }
    
    /**
     * 执行写入操作
     * @param {number} level 
     * @param {string}message 
     * @param {any} args
     * @return {Promise}
     */
    async log(level, message, ...args){
        
        this.index++;

        if(!this.needLog(level)){
            return false;
        }
        await this.logRun(level, message, ...args);

        return true;
    }

    /**
     * （保护类）正式执行写入操作。所有继承类必须实现该方法
     * @param {number} level 
     * @param {string}message 
     * @param {any} args
     * @return {Promise}
     */
    async logRun(level, message, ...args){

    }


}

export default LoggerWriterDefault;