import LoggerWriterStdout from "../../../../../src/app/logger/writer/LoggerWriterStdout.mjs";



describe('LoggerWriterStdout', function() {

    it('Test setLevel', async function() {
        
        const writer = new LoggerWriterStdout();
        
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
        
        const writer = new LoggerWriterStdout();
        
        const level = 5;

        writer.setLevel(level);

        if(!writer.needLog(10)){
            return ;
        }

        throw new Error("result unexpected need log");

    });

    it('Test needLog normal - need log equal', async function() {
        
        const writer = new LoggerWriterStdout();
        
        const level = 5;

        writer.setLevel(level);

        if(writer.needLog(5)){
            return ;
        }

        throw new Error("result unexpected no need log");

    });


    it('Test needLog normal - need log below', async function() {
        
        const writer = new LoggerWriterStdout();
        
        const level = 5;

        writer.setLevel(level);

        if(writer.needLog(0)){
            return ;
        }

        throw new Error("result unexpected no need log");

    });

    it('Test log normal - no need log below', async function() {
        
        const writer = new LoggerWriterStdout();
        
        const level = 5;

        writer.setLevel(level);

        const result = await writer.log(10, "test");

        if(false == result){
            return ;
        }

        throw new Error("result unexpected logged");

    });

    it('Test log normal - need log below', async function() {
        
        const writer = new LoggerWriterStdout();
        
        const level = 5;

        writer.setLevel(level);

        const result = await writer.log(3, "test");

        if(true !== result){
            throw new Error("result unexpected not logged");
        }

        const result2 = await writer.log(2, "test2", 3, 666);

        if(true !== result2){
            throw new Error("result unexpected not logged");
        }


    });

    it('Test log normal - need log on debug', async function() {
        
        const writer = new LoggerWriterStdout();
        
        const level = 7;

        writer.setLevel(level);

        for(let i = 0; i <= level;  i++){

            let result = await writer.log(i, "test", i);

            if(true !== result){
                throw new Error("result unexpected not logged in level "+ i);
            }
        }

    });


});

