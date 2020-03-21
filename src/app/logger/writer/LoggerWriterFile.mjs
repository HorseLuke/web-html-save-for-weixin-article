import path from "path";
import util from "util";
import fs from "fs";
import LoggerWriterDefault from "./LoggerWriterDefault.mjs";

/**
 * 文件记录器。部分代码改自node-logger
 * @link https://github.com/quirkey/node-logger/blob/master/logger.js
 */
class LoggerWriterFile extends LoggerWriterDefault{

    constructor(){
        super();
        this._filepath = "";
    }

    setFilepath(userpath){
        try{
            const pathFinal = path.normalize(userpath);
            this._filepath = pathFinal;
            return this._filepath;
        }catch(e){
            console.error(e);
            return this._filepath;
        }
        
    }

    getFilepath(){
        return this._filepath;
    }

    async logRun(level, message, ...args){
        
        if(this._filepath == ""){
            return ;
        }

        const date = new Date();

        let messageToWrite =  this.index + "\t" + date.toLocaleString() + "\t" + "LEVEL_" + level + "\t" + this._logRunToString(message, ...args) + "\r\n";
        
        fs.writeFileSync(this._filepath, messageToWrite, {flag: 'a', encoding: 'utf8', mode: 0o666});
        
    }

    _logRunToString(message, ...args){
        let msg2 = "";

        if(arguments.length < 1){
            return msg2;
        }

        for(let i in arguments){
            let typeX = typeof arguments[i];
            if(typeX == "number"){
                msg2 += arguments[i].toString();
            }else if(typeX == "string"){
                msg2 += arguments[i];
            }else{
                msg2 += util.inspect(arg, false, 5);
            }

            msg2 += "\t";
        }

        return msg2;

    }



}


export default LoggerWriterFile;