import { fileURLToPath } from "url";
import { dirname } from "path";
import BootstarpService from "./app/base/service/BootstarpService.mjs";
import yargs from "yargs";
import {ucfirst, lcfirst} from "./app/base/helper/StrHelper.mjs";
import AbstractDispatcher from "./app/dispatch/base/AbstractDispatcher.mjs";
import util from "util";

if(!process.env.NODE_ENV){
    process.env.NODE_ENV = "production";
}


//https://nodejs.org/en/knowledge/command-line/how-to-parse-command-line-arguments/
const argv = yargs
    .option('ctype', {
        description: 'Controller Type Name',
        default: "cli",
        type: 'string',
    })
    .option('router', {
        alias: 'r',
        description: 'Router Path',
        default: "index/index/index",
        type: 'string',
    })
    .help()
    .alias('help', 'h')
    .argv;

console.log("process.env.NODE_ENV is " + process.env.NODE_ENV);

console.log(argv);


//全局唯一启动模块
/**
 * @var {BootstarpService}
 */
const BootstarpSrv = BootstarpService.instance;    //启动唯一启动模块

if(!BootstarpSrv.checkCtype(argv.ctype)){
    throw new Error("ctype option not right!");
}

const routerResult = BootstarpSrv.parseRouter(argv.router);
if(routerResult.error != 0){
    throw new Error("router option not right!");
}

//console.log(util.inspect(process.env, false, null, true /* enable colors */));

//设置常见变量
//https://stackoverflow.com/questions/50268077/dirname-is-not-defined-in-node-js-10-experimental
const appDirPath = dirname(fileURLToPath(import.meta.url));

process.env.NODE_CONFIG_DIR = appDirPath + "/config";
BootstarpSrv.setAppdir(appDirPath);
Object.freeze(BootstarpSrv);

console.log("BootstarpService.instance.getAppdir() is " + BootstarpSrv.getAppdir());

//初始化应用
(async () => {
    const config = await import("config");

    const dispatcherFilePath = "app/dispatch/" + lcfirst(argv.ctype) + "/Dispatcher.mjs";

    let dispatcherPathClass = null;

    let dispatcherInstance = null;
    
    try{

        dispatcherPathClass = await BootstarpSrv.ESMImportFromAppdir(dispatcherFilePath);

        dispatcherInstance = new dispatcherPathClass.default();

        if((dispatcherInstance instanceof AbstractDispatcher) != true){
            throw new Error("Dispatch file not instanceof AbstractDispatcher");
        }


    }catch(e){
        BootstarpService.instance.getLogger().log(
            BootstarpService.getConstant("MSG_LEVEL_EMERG"),
            "dispatch init failed",
            {
                "argv.ctype": argv.ctype,
                "argv.router": argv.router,
                dispatcherFilePath: dispatcherFilePath
            },
            e
        );
        return ;
    }

    try{

        await dispatcherInstance.dispatch(argv.ctype, routerResult, argv);

    }catch(e){
        BootstarpService.instance.getLogger().log(
            BootstarpService.getConstant("MSG_LEVEL_EMERG"),
            "dispatch run error",
            {
                "argv.ctype": argv.ctype,
                "argv.router": argv.router,
                dispatcherFilePath: dispatcherFilePath
            },
            e
        );
        return ;
    }


})();

