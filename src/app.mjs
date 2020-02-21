import { fileURLToPath } from "url";
import { dirname } from "path";
import Bootstarp from "./modules/base/service/Bootstarp.mjs";

console.log(process.env.NODE_ENV);

//设置常见变量
//https://stackoverflow.com/questions/50268077/dirname-is-not-defined-in-node-js-10-experimental
const appDirPath = dirname(fileURLToPath(import.meta.url));
process.env.NODE_CONFIG_DIR = appDirPath + "/config";
Bootstarp.instance.setAppdir(appDirPath);
console.log(Bootstarp.instance.getAppdir());

//初始化应用
(async () => {
    const config = await import("config");
    console.log(config.default.get("lastName"));
})();

console.log("33333");

