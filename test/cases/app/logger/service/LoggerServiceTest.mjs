import LoggerService from "../../../../../src/app/logger/service/LoggerService.mjs";
import * as Constants from "../../../../../src/app/base/helper/Constants.mjs";
import LoggerWriterStdout from "../../../../../src/app/logger/writer/LoggerWriterStdout.mjs";

describe('LoggerServiceTest', function() {

    it("Constants check", async function() {

        if(LoggerService.MSG_LEVEL_EMERG !== Constants.MSG_LEVEL_EMERG){
            throw new Error("LoggerService.MSG_LEVEL_EMERG !== Constants.MSG_LEVEL_EMERG");
        }

        if(LoggerService.MSG_LEVEL_ALERT !== Constants.MSG_LEVEL_ALERT){
            throw new Error("LoggerService.MSG_LEVEL_ALERT !== Constants.MSG_LEVEL_ALERT");
        }

        if(LoggerService.MSG_LEVEL_CRIT !== Constants.MSG_LEVEL_CRIT){
            throw new Error("LoggerService.MSG_LEVEL_CRIT !== Constants.MSG_LEVEL_CRIT");
        }

        if(LoggerService.MSG_LEVEL_ERR !== Constants.MSG_LEVEL_ERR){
            throw new Error("LoggerService.MSG_LEVEL_ERR !== Constants.MSG_LEVEL_ERR");
        }

        if(LoggerService.MSG_LEVEL_WARN !== Constants.MSG_LEVEL_WARN){
            throw new Error("LoggerService.MSG_LEVEL_WARN !== Constants.MSG_LEVEL_WARN");
        }

        if(LoggerService.MSG_LEVEL_NOTICE !== Constants.MSG_LEVEL_NOTICE){
            throw new Error("LoggerService.MSG_LEVEL_NOTICE !== Constants.MSG_LEVEL_NOTICE");
        }

        if(LoggerService.MSG_LEVEL_INFO !== Constants.MSG_LEVEL_INFO){
            throw new Error("LoggerService.MSG_LEVEL_INFO !== Constants.MSG_LEVEL_INFO");
        }

        if(LoggerService.MSG_LEVEL_DEBUG !== Constants.MSG_LEVEL_DEBUG){
            throw new Error("LoggerService.MSG_LEVEL_DEBUG !== Constants.MSG_LEVEL_DEBUG");
        }

    });

    it("setWriter / getWriter / delWriter", async function() {
        
        const log = new LoggerService();
        const std = new LoggerWriterStdout();
        const name = "stdout";

        const setRes = log.setWriter(name, std);
        if(!setRes){
            throw new Error("setWriter error");
        }

        if(log.getWriter(name) !== std){
            throw new Error("getWriter error");
        }

        log.delWriter(name);

        if(typeof log.getWriter(name) !== "undefined"){
            throw new Error("getWriter unexpected exists after delWriter");
        }

    });


    it("setWriter by not writer", async function() {
        
        const log = new LoggerService();
        const name = "not_writer";

        const setRes = log.setWriter(name, String("NOT WRITER"));
        if(setRes){
            throw new Error("setWriter error: UNEXPECTED " + setRes);
        }

        if(typeof log.getWriter(name) !== "undefined"){
            throw new Error("getWriter unexpected exists");
        }

    });

    it("log", async function() {
        
        const log = new LoggerService();
        const std = new LoggerWriterStdout();
        std.setLevel(LoggerService.MSG_LEVEL_WARN);
        const name = "stdout";

        log.setWriter(name, std);
        await log.log(LoggerService.MSG_LEVEL_WARN, "WARN");
        await log.log(LoggerService.MSG_LEVEL_ERR, "ERR");
        await log.log(LoggerService.MSG_LEVEL_EMERG, "EMERG", new Error("EMERG"), new Date());

        await log.log(LoggerService.MSG_LEVEL_INFO, "INFO");

    });


    it("logAsync", async function() {
        
        const log = new LoggerService();
        const std = new LoggerWriterStdout();
        std.setLevel(LoggerService.MSG_LEVEL_INFO);
        const name = "stdout";

        log.setWriter(name, std);
        log.logAsync(LoggerService.MSG_LEVEL_WARN, "WARN");
        log.logAsync(LoggerService.MSG_LEVEL_ERR, "ERR");
        log.logAsync(LoggerService.MSG_LEVEL_EMERG, "EMERG", new Error("EMERG"), new Date());

        log.logAsync(LoggerService.MSG_LEVEL_INFO, "INFO");

    });

});

