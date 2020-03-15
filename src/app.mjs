import { fileURLToPath } from "url";
import { dirname } from "path";
import BootstarpService from "./app/base/service/BootstarpService.mjs";
import yargs from "yargs";

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


//全局唯一启动模块
/**
 * @var {BootstarpService}
 */
BootstarpService.instance;    //启动唯一启动模块

console.log("process.env.NODE_ENV is " + process.env.NODE_ENV);

console.log(argv);

if(!BootstarpService.instance.checkCtype(argv.ctype)){
    throw new Error("ctype option not right!");
}

const routerResult = BootstarpService.instance.parseRouter(argv.router);
if(routerResult.error != 0){
    throw new Error("router option not right!");
}


//console.log(util.inspect(process.env, false, null, true /* enable colors */));

//设置常见变量
//https://stackoverflow.com/questions/50268077/dirname-is-not-defined-in-node-js-10-experimental
const appDirPath = dirname(fileURLToPath(import.meta.url));

process.env.NODE_CONFIG_DIR = appDirPath + "/config";
BootstarpService.instance.setAppdir(appDirPath);
Object.freeze(BootstarpService.instance);

console.log("BootstarpService.instance.getAppdir() is " + BootstarpService.instance.getAppdir());

//初始化应用
(async () => {
    const config = await import("config");

})();

