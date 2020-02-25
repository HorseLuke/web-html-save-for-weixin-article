import {readFileSync} from "fs";
import randomstring from "randomstring";
import BrowserContainerService from "../../playwright/service/BrowserContainerService.mjs";
import {checkUrlIsInHostList} from "../../base/helper/UrlHelper.mjs";



class FetchService{

    constructor(){
    }

    async fetch(url){

        if(checkUrlIsInHostList(url, ["mp.weixin.qq.com"]) != 0){
            throw new Error("NOT mp.weixin.qq.com");
        }

        const currentTime = new Date();

        const articleMeta = {
            id: "",
            url: url,
            save_timestamp: 0,
            save_date: "1900-00-00"
        };

        articleMeta.save_timestamp = parseInt(currentTime.getTime() / 1000);
        articleMeta.save_date = [
            currentTime.getFullYear(),
            ('0'+ (currentTime.getMonth() + 1)).slice(-2),
            ('0'+ currentTime.getDate()).slice(-2)
        ].join("-");
        articleMeta.id = articleMeta.save_date + "-" + randomstring.generate(16);

        //初始化browser
        const browserContainerInstance = await BrowserContainerService.createInstanceByConfigName("chromium", "playwrightChromiumLaunchDefault");

        //主流程
        try{
            const page = await browserContainerInstance.createNewContextAndPage(url, {
                bypassCSP: true
            });

            page.on("domcontentloaded", async () => {
                console.log("domcontentloaded");
                return 1;
            });

            const bodyHandle = await page.$wait("body");

            await page.addScriptTag({
                content: String(readFileSync(global.BootstarpInstance.getAppdir() + "/browser/script/base/BaseHelper.js")),
            });

            await page.addScriptTag({
                content: String(readFileSync(global.BootstarpInstance.getAppdir() + "/browser/script/mparticle/FetchServiceEvaluateHandleHelper.js")),
            });

            const navigatorJSHandle = await page.evaluateHandle(() => {
                return window.FetchServiceEvaluateHandleHelper.getUserAgent();
            });
    
            console.log(await navigatorJSHandle.jsonValue());

            const imgJSHandle = await page.evaluateHandle(() => {
                return window.FetchServiceEvaluateHandleHelper.getMpImgList();
            });

            console.log(await imgJSHandle.jsonValue());
            
            const pageHTMLJSHandler = await page.evaluateHandle(() => {
                return window.FetchServiceEvaluateHandleHelper.getMainHTML();
            });

            console.log(await pageHTMLJSHandler.jsonValue());

    
        }catch(e){
            //throw之前，强制关闭浏览器
            browserContainerInstance.close();
            throw e;
        }

        //关闭浏览器
        await new Promise(resolve => setTimeout(resolve, 100000));    //暂停5秒
        //await page.screenshot({path: 'screenshot.png'});
        await browserContainerInstance.close();

        return 0;

    }

}

export default FetchService;