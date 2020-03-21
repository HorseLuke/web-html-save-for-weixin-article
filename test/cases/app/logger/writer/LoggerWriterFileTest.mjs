import LoggerWriterFile from "../../../../../src/app/logger/writer/LoggerWriterFile.mjs";
import fs from "fs";


describe('LoggerWriterFile', function() {


    const _testcaseLogFilepath = "R:/TEMP/TEMP_LOG_CAN_DELETED_" + Math.random() + ".log";

    const _delLogFileAfterTest = 1;
    
    it('Test setLevel', async function() {
        
        const writer = new LoggerWriterFile();
        
        const level = 5;

        const levelResult = writer.setLevel(level);

        if(level != levelResult){
            throw new Error("result unexpected level");
        }

        if(level != writer.getLevel()){
            throw new Error("result unexpected level from getLevel");
        }

    });

    
    it('Test needLog normal - No need log', async function() {
        
        const writer = new LoggerWriterFile();
        
        const level = 5;

        writer.setLevel(level);

        if(!writer.needLog(10)){
            return ;
        }

        throw new Error("result unexpected need log");

    });

    it('Test needLog normal - need log equal', async function() {
        
        const writer = new LoggerWriterFile();
        
        const level = 5;

        writer.setLevel(level);

        if(writer.needLog(5)){
            return ;
        }

        throw new Error("result unexpected no need log");

    });


    it('Test needLog normal - need log below', async function() {
        
        const writer = new LoggerWriterFile();
        
        const level = 5;

        writer.setLevel(level);

        if(writer.needLog(0)){
            return ;
        }

        throw new Error("result unexpected no need log");

    });

    it('Test log normal - no need log below', async function() {
        
        const writer = new LoggerWriterFile();
        
        const level = 5;

        writer.setLevel(level);

        const result = await writer.log(10, "test");

        if(false == result){
            return ;
        }

        throw new Error("result unexpected logged");

    });

    it('Test log normal - need log below', async function() {
        
        const writer = new LoggerWriterFile();

        writer.setFilepath(_testcaseLogFilepath);
        
        const level = 5;

        writer.setLevel(level);

        const result = await writer.log(3, "test");

        if(true !== result){
            throw new Error("result unexpected not logged");
        }

        const rdn = "rdn_" + Math.random();

        const result2 = await writer.log(2, "test2", 3, rdn);

        if(true !== result2){
            throw new Error("result unexpected not logged");
        }

        const logdata = fs.readFileSync(_testcaseLogFilepath, {encoding: "utf8"});

        if(!logdata.includes(rdn)){
            throw new Error("result unexpected not logged in file");
        }


    });


    after(async function() {
        try{
            if (_delLogFileAfterTest == 1 && fs.existsSync(_testcaseLogFilepath)) {
                fs.unlinkSync(_testcaseLogFilepath);
            }
        }catch(e){
            console.log(e);
        }
    });
    

});

