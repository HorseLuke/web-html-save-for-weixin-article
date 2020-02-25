import { fileURLToPath } from "url";
import { dirname } from "path";
import util from 'util';
//import moduleAlias from "module-alias";
import Bootstarp from "./app/base/service/BootstarpService.mjs";

//全局注册唯一启动模块
/**
 * @var Bootstarp
 */
global.BootstarpInstance = Bootstarp.instance;

console.log("process.env.NODE_ENV is " + process.env.NODE_ENV);

//console.log(util.inspect(process.env, false, null, true /* enable colors */));

//设置常见变量
//https://stackoverflow.com/questions/50268077/dirname-is-not-defined-in-node-js-10-experimental
const appDirPath = dirname(fileURLToPath(import.meta.url));

process.env.NODE_CONFIG_DIR = appDirPath + "/config";
global.BootstarpInstance.setAppdir(appDirPath);
Object.freeze(global.BootstarpInstance);

console.log("global.BootstarpInstance.getAppdir() is " + global.BootstarpInstance.getAppdir());

/*
moduleAlias.addAliases({
    '@root': appDirPath,
    '@app': appDirPath + '/app'
});
*/

//初始化应用
(async () => {
    const config = await import("config");

    /*
    const testCtrl = await global.BootstarpInstance.ESMImportFromAppdir("app/mparticle/testcontroller/FetchOneArticleTestController.mjs");
    const testCtrlInstance = new testCtrl.default();
    const result = await testCtrlInstance.testWithMultiPic();
    */
   const testCtrl = await global.BootstarpInstance.ESMImportFromAppdir("app/download/testcontroller/BatchImageDownloadTestController.mjs");
   const testCtrlInstance = new testCtrl.default();
   const result = await testCtrlInstance.testBatch();

    console.log(result);


})();

