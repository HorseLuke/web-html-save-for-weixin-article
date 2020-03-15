import { fileURLToPath } from "url";
import { dirname } from "path";
import BootstarpService from "../src/app/base/service/BootstarpService.mjs";

if(!process.env.NODE_ENV){
    process.env.NODE_ENV = "production";
}

//全局唯一启动模块
/**
 * @var {BootstarpService}
 */
BootstarpService.instance;    //启动唯一启动模块

console.log("process.env.NODE_ENV is " + process.env.NODE_ENV);

//console.log(util.inspect(process.env, false, null, true /* enable colors */));

//设置常见变量
//https://stackoverflow.com/questions/50268077/dirname-is-not-defined-in-node-js-10-experimental
const appDirPath = dirname(dirname(fileURLToPath(import.meta.url))) + "/src";

process.env.NODE_CONFIG_DIR = appDirPath + "/config";
BootstarpService.instance.setAppdir(appDirPath);
Object.freeze(BootstarpService.instance);

console.log("BootstarpService.instance.getAppdir() is " + BootstarpService.instance.getAppdir());


//初始化应用
(async () => {
    
    const config = await import("config");

    //运行测试
    setTimeout(function() {
        
        describe('Root level', function() {
    
            it('Test can run', function(done) {
                done();
            });
        
        });
        
        run();
    
    }, 1000);
    
})();


