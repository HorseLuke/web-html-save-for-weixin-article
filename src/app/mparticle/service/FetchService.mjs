import BrowserContainerService from "../../playwright/service/BrowserContainerService.mjs";
import {checkUrlIsInHostList} from "../../base/helper/UrlHelper.mjs";

class FetchService{

    constructor(){
    }

    async fetch(url){

        if(checkUrlIsInHostList(url, ["mp.weixin.qq.com"])){
            throw new Error("NOT mp.weixin.qq.com");
        }

        //初始化browser
        const browserContainerInstance = await BrowserContainerService.createInstanceByConfigName("chromium", "playwrightChromiumLaunchDefault");

        //主流程
        try{
            const browser = browserContainerInstance.getBrowser();
            const context = await browser.newContext({
                locale: "zh-CN",
                timezoneId: "Asia/Shanghai",
            });
            const page = await context.newPage();
            await page.goto(url);
            const handle = await page.$wait("#img-content");
    
            const navigatorHandle = await page.evaluateHandle(function(){
                //console.log(navigator);
                return navigator;
            });
    
            const resultNavigatorHandle = await page.evaluateHandle(function(navigator){
                return {
                    useragent: navigator.userAgent
                };
            }, navigatorHandle);
            
            console.log(await resultNavigatorHandle.jsonValue());
    
        }catch(e){
            //throw之前，强制关闭浏览器
            browserContainerInstance.close();
            throw e;
        }

        //关闭浏览器
        await new Promise(resolve => setTimeout(resolve, 1000));    //暂停5秒
        //await page.screenshot({path: 'screenshot.png'});
        await browserContainerInstance.close();

        return 0;

    }


}

export default FetchService;