import * as Constants from "../../base/helper/Constants.mjs";
import LoggerWriterDefault from "../writer/LoggerWriterDefault.mjs";

/**
 * 记录器。
 */
class LoggerService{

    static get MSG_LEVEL_EMERG(){
        return Constants.MSG_LEVEL_EMERG;
    }

    static get MSG_LEVEL_ALERT(){
        return Constants.MSG_LEVEL_ALERT;
    }

    static get MSG_LEVEL_CRIT(){
        return Constants.MSG_LEVEL_CRIT;
    }

    static get MSG_LEVEL_ERR(){
        return Constants.MSG_LEVEL_ERR;
    }

    static get MSG_LEVEL_WARN(){
        return Constants.MSG_LEVEL_WARN;
    }

    static get MSG_LEVEL_NOTICE(){
        return Constants.MSG_LEVEL_NOTICE;
    }

    static get MSG_LEVEL_INFO(){
        return Constants.MSG_LEVEL_INFO;
    }

    static get MSG_LEVEL_DEBUG(){
        return Constants.MSG_LEVEL_DEBUG;
    }

    constructor(){
        this.writers = {};
    }
    
    /**
     * 设置一个写入器
     * @param {string} writerName 
     * @param {LoggerWriterDefault} writer 
     * @return {boolean}
     */
    setWriter(writerName, writer){
        if(writer instanceof LoggerWriterDefault){
            this.writers[writerName] = null;
            this.writers[writerName] = writer;
            return true;
        }
        return false;
    }

    /**
     * 获取一个写入器
     * @param {string} writerName
     * @return {LoggerWriterDefault|undefined}
     */
    getWriter(writerName){
        if(this.writers.hasOwnProperty(writerName)){
            return this.writers[writerName];
        }
        return undefined;
    }

    /**
     * 删除一个写入器
     * @param {string} writerName 
     */
    delWriter(writerName){
        if(this.writers.hasOwnProperty(writerName)){
            delete this.writers[writerName];
        }
    }

    /**
     * 记录
     * @param {number} level 
     * @param {string} message 
     * @param {...any} args 
     * @return {Promise}
     */
    async log(level, message, ...args){

        if(!Number.isInteger(level)){
            return false;
        }

        for(let i in this.writers){
            await this._logRunWriter(i, level, message, ...args);
        }

        return false;

    }

    /**
     * 非同步记录，不考虑是否已经执行成功
     * @param {number} level 
     * @param {string} message 
     * @param {...any} args 
     * @return {boolean}
     */
    logAsync(level, message, ...args){

        if(!Number.isInteger(level)){
            return false;
        }

        for(let i in this.writers){
            this._logRunWriter(i, level, message, ...args);
        }

        return true;

    }

    async _logRunWriter(i, level, message, ...args){
        try{
            await this.writers[i].log(level, message, ...args);
        }catch(e){
            console.error("Writer Log Error from "+ i);
            console.error(e);
        }
    }

}


export default LoggerService;