import BrowserContainerService from "../../playwright/service/BrowserContainerService.mjs";
import {checkUrlIsInHostList} from "../../base/helper/UrlHelper.mjs";
import randomstring from "randomstring";
import {readFileSync} from "fs";

class FetchService{

    constructor(){
    }

    async fetch(url){

        if(checkUrlIsInHostList(url, ["mp.weixin.qq.com"]) != 0){
            throw new Error("NOT mp.weixin.qq.com");
        }


        const articleMeta = {
            url: url,
            save_time: parseInt(new Date().getTime() / 1000)
        };

        articleMeta.id = articleMeta.save_time + randomstring.generate(16);

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
                content: String(readFileSync(global.BootstarpInstance.getAppdir() + "/browser/script/BaseHelper.js")),
            });

            const navigatorJSHandle = await page.evaluateHandle(() => {
                return {
                    userAgent: navigator.userAgent
                };
            });
    
            console.log(await navigatorJSHandle.jsonValue());

            const imgJSHandle = await page.evaluateHandle(() => {
                let imgListResult = [];
                let list = document.querySelectorAll(".rich_media_content img");
                if(list.length < 1){
                    return imgListResult;
                }

                for(let i=0; i < list.length; i++){
                    let imgObj = list[i];
                    let src = imgObj.getAttribute("data-src");
                    if(window.xHelperFunctionInBrowserContext.checkUrlIsInHostList(src, ["mmbiz.qpic.cn"]) != 0){
                        continue;
                    }
                    let randomstr = (i + 1) + "-" + window.xHelperFunctionInBrowserContext.generateRandomStr(16);
                    imgObj.setAttribute("data-x-replace-token", randomstr);
                    imgObj.setAttribute("data-x-src-origin", src);
                    imgObj.setAttribute("data-x-need-replace-download", 1);
                    imgListResult.push({
                        "data-x-replace-token": randomstr,
                        "data-x-src-origin": src
                    });
                }

                return imgListResult;

            });

            console.log(await imgJSHandle.jsonValue());
            
            const pageHTMLJSHandler = await page.evaluateHandle(() => {
                let title = document.querySelector(".rich_media_title").innerText;
                try{
                    document.querySelector("#js_profile_qrcode").style.display = "block";
                }catch(e){
                    console.error(e);
                }
                let authorHtml = document.querySelector(".rich_media_meta_list").innerHTML;
                let contentHtml = document.querySelector(".rich_media_content").innerHTML;

                return {
                    title: title,
                    authorHtml: authorHtml,
                    contentHtml: contentHtml
                };

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

    async downloadImagelist(imglist, options){

        var result = [];

        try{


        }catch(e){
            return result;
        }

    }


    async downloadImage(src, options){
        const result = {
            "ori-src": src,
            "new-src": "",
            "id": options.resid ? options.resid : ""
        };
    }



}

export default FetchService;