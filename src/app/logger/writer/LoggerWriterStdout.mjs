import * as Constants from "../../base/helper/Constants.mjs";
import LoggerWriterDefault from "./LoggerWriterDefault.mjs";

class LoggerWriterStdout extends LoggerWriterDefault{

    constructor(){
        super();
    }

    async logRun(level, message, ...args){

        const date = new Date();

        let method = "debug";
        if(level <= Constants.MSG_LEVEL_ERR){
            method = "error";
        }else if(level <= Constants.MSG_LEVEL_WARN){
            method = "warn";
        }else if(level <= Constants.MSG_LEVEL_NOTICE){
            method = "log";
        }else if(level <= Constants.MSG_LEVEL_INFO){
            method = "info";
        }

        if(args.length < 1){
            console[method].call(null, this.index, date.toLocaleString(), "LEVEL_" + level, message);
        }else{
            console[method].call(null, this.index, date.toLocaleString(), "LEVEL_" + level, message, ...args);
        }

    }

}


export default LoggerWriterStdout;