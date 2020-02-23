import config from "config";
import * as playwright from "playwright-core";
import {checkUrlIsInHostList} from "../../base/helper/UrlHelper.mjs";

class PlaywrightFetchService{

    constructor(){
    }

    async fetch(url){
        if(checkUrlIsInHostList(url, ["mp.weixin.qq.com"])){
            throw new Error("NOT mp.weixin.qq.com");
        }
        const launchOptions = config.get("playwrightChromiumLaunchDefault");
        const browser = await playwright.default.chromium.launch(launchOptions);
        const page = await browser.newPage();
        await page.goto(url);
        await new Promise(resolve => setTimeout(resolve, 5000));    //暂停5秒
        await browser.close();
        return 0;
    }

}

export default PlaywrightFetchService;