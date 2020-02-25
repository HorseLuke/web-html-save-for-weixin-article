import {readFileSync} from "fs";
import randomstring from "randomstring";
import config from "config";
import BrowserContainerService from "../../playwright/service/BrowserContainerService.mjs";
import {checkUrlIsInHostList} from "../../base/helper/UrlHelper.mjs";
import ImageDownloadService from "../../download/service/ImageDownloadService.mjs";


class FetchService{

    constructor(){
    }

    async fetch(url){

        if(checkUrlIsInHostList(url, ["mp.weixin.qq.com"]) != 0){
            throw new Error("NOT mp.weixin.qq.com");
        }

        const currentTime = new Date();

        const articleMeta = {
            id: "1900-00-00-test0000",
            url: url,
            save_timestamp: 0,
            save_date: "1900-00-00",
            save_timecode: "000000",
            save_dir: "",
            success: false,
        };

        articleMeta.save_timestamp = parseInt(currentTime.getTime() / 1000);
        articleMeta.save_date = [
            currentTime.getFullYear(),
            ('0'+ (currentTime.getMonth() + 1)).slice(-2),
            ('0'+ currentTime.getDate()).slice(-2)
        ].join("-");
        articleMeta.save_timecode = [
            ('0'+ currentTime.getHours()).slice(-2),
            ('0'+ currentTime.getMinutes()).slice(-2),
            ('0'+ currentTime.getSeconds()).slice(-2)
        ].join("");
        articleMeta.id = randomstring.generate(32);
        articleMeta.save_dir = config.get("mpArticleSave.dir_path") + "/" + articleMeta.save_date + "/" + articleMeta.save_timecode + "_" +  articleMeta.id;

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
                content: String(readFileSync(global.BootstarpInstance.getAppdir() + "/browser/script/mparticle/FetchServiceMpArticleEvaluateHandleHelper.js")),
            });

            const detectInfo = await page.evaluate(() => {
                return window.FetchServiceMpArticleEvaluateHandleHelper.detectArticleStatus();
            });
            
            if(detectInfo != 0){
                await browserContainerInstance.close();
                return articleMeta;
            }
    

            const navigatorJSHandlePromise = page.evaluateHandle(() => {
                return window.FetchServiceMpArticleEvaluateHandleHelper.getUserAgent();
            });
    
            const imgJSHandlePromise = page.evaluateHandle(() => {
                return window.FetchServiceMpArticleEvaluateHandleHelper.getMpImgList();
            });

            const pageHTMLJSHandlePromise = await page.evaluateHandle(() => {
                return window.FetchServiceMpArticleEvaluateHandleHelper.getMainHTML();
            });
            
            const htmlEvaluateResult = await Promise.all([
                navigatorJSHandlePromise,
                imgJSHandlePromise,
                pageHTMLJSHandlePromise
            ]);

            const imageListDownloaded = await this._downloadImageFromEvaluateResult(articleMeta, htmlEvaluateResult[0], htmlEvaluateResult[1]);

            console.log(imageListDownloaded);

            //await page.goto("file://" + global.BootstarpInstance.getAppdir() + "/browser/html/MpArticleBlank.html");

    
        }catch(e){
            //throw之前，强制关闭浏览器
            browserContainerInstance.close();
            throw e;
        }

        //关闭浏览器
        await new Promise(resolve => setTimeout(resolve, 100000));    //暂停5秒
        //await page.screenshot({path: 'screenshot.png'});
        await browserContainerInstance.close();

        return articleMeta;

    }


    async _downloadImageFromEvaluateResult(articleMeta, navigatorJSHandle, imgJSHandle){

        const navigatorInfo = await navigatorJSHandle.jsonValue();

        const imageDownloadDefaultOptions = {
            headers: {
                Referer: articleMeta.url,
                "user-agent": navigatorInfo.userAgent
            },
            save: {
                dir_path: articleMeta.save_dir + "/images/",
                url_prefix: "./images/",
            }
        };

        const imageList = await imgJSHandle.jsonValue();

        const imageNeedDownload = [];

        for(let i=0; i < imageList.length; i++){
            let row = imageList[i];
            let newRow = {
                url: row["data-x-src-origin"],
                options: {
                    "unique-id": row["data-x-replace-token"], 
                    save: { 
                        name: row["data-x-replace-token"]
                    }
                },
            };

            imageNeedDownload.push(newRow);
        }

        const ImageDownloadServiceInstance = new ImageDownloadService();

        const result = await ImageDownloadServiceInstance.downloadImagelist(imageNeedDownload, imageDownloadDefaultOptions);
        return result;

    }

}

export default FetchService;