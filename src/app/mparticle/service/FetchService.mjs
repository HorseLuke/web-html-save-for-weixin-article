import fs from "fs";
import randomstring from "randomstring";
import config from "config";
import BootstarpService from "../../base/service/BootstarpService.mjs";
import {checkUrlIsInHostList} from "../../base/helper/UrlHelper.mjs";
import ImageDownloadService from "../../download/service/ImageDownloadService.mjs";
import PlaywrightHelper from "../../playwright/helper/PlaywrightHelper.mjs";

class FetchService{

    constructor(){
    }

    /**
     * 
     * @param url 
     * @param maxPageTimeout 
     */
    async fetch(url, maxPageTimeout){

        if(checkUrlIsInHostList(url, ["mp.weixin.qq.com"]) != 0){
            throw new Error("NOT mp.weixin.qq.com");
        }

        url = url.replace(/^http:\/\//i, 'https://');

        const mpArticleSaveRoot = config.get("mpArticleSave.dir_path");

        const maxBrowserTimeout = maxPageTimeout || 300000;

        
        const currentTime = new Date();

        const articleMeta = {
            id: "1900-00-00-test0000",
            url: url,
            title: "",
            save_timestamp: 0,
            save_date: "1900-00-00",
            save_time: "00:00:00",
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
        articleMeta.save_time = [
            ('0'+ currentTime.getHours()).slice(-2),
            ('0'+ currentTime.getMinutes()).slice(-2),
            ('0'+ currentTime.getSeconds()).slice(-2)
        ].join(":");
        articleMeta.save_timecode = articleMeta.save_time.replace(/:/g, '');
        
        articleMeta.id = randomstring.generate(32);
        articleMeta.save_dir = mpArticleSaveRoot + "/" + articleMeta.save_date + "/" + articleMeta.save_timecode + "_" +  articleMeta.id;

        do{
            if(fs.existsSync(articleMeta.save_dir)){
                break;
            }

            fs.mkdirSync(articleMeta.save_dir, {
                recursive: true
            });

        }while(false);

        
        //初始化browser
        const browserInstance = await PlaywrightHelper.createBrowserByConfigName("chromium", "playwrightChromiumLaunchDefault", maxBrowserTimeout);

        try{
            await this._fetchRunner(articleMeta, browserInstance, maxPageTimeout, mpArticleSaveRoot);
        }catch(e){
            console.error(e);
        }

        //关闭浏览器
        const closeBrowserTimeout = 30;
        await new Promise(resolve => setTimeout(resolve, closeBrowserTimeout));    //暂停closeBrowserTimeout毫秒
        //await page.screenshot({path: 'screenshot.png'});
        await browserInstance.close();

        return articleMeta;

    }


    async _fetchRunner(articleMeta, browserInstance, maxPageTimeout, mpArticleSaveRoot){
        

        maxPageTimeout = maxPageTimeout || 300000;    //默认最多只能运行300秒
        const maxBrowserContextTimeout = maxPageTimeout;

        let browserContextInstance = null;
        let page = null;

        //主流程
        try{

            browserContextInstance = await PlaywrightHelper.createBrowserContext(browserInstance, 
                {
                    bypassCSP: true,
                    userAgent: "Mozilla/5.0 (Linux; Android 8.0; Pixel 2 Build/OPD3.170816.012) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3765.0 Mobile Safari/537.36 SaveEditorsLife/0.0.1",
                    viewport: {
                        'width': 731,
                        'height': 411,
                        'deviceScaleFactor': 1,
                        'isMobile': true              
                    }
                },
                maxBrowserContextTimeout    //默认只能运行5分钟
            );

            page = await PlaywrightHelper.createPage(browserContextInstance, articleMeta.url, maxPageTimeout);

            page.on("domcontentloaded", async () => {
                console.log("domcontentloaded");
                return 1;
            });

            await page.$wait("body");
            
            /*
            console.log("page.screenshot now");

            await page.screenshot({
                fullPage: true,
                type: "jpeg",
                quality: 90,
                omitBackground: false,
                path: articleMeta.save_dir + '/screenshot-full.jpeg'
            });
            */

            await page.addScriptTag({
                content: String(fs.readFileSync(BootstarpService.instance.getAppdir() + "/browser/script/base/BaseHelper.js")),
            });

            await page.addScriptTag({
                content: String(fs.readFileSync(BootstarpService.instance.getAppdir() + "/browser/script/mparticle/FetchServiceMpArticleEvaluateHandleHelper.js")),
            });

            const detectInfo = await page.evaluate(() => {
                return window.FetchServiceMpArticleEvaluateHandleHelper.detectArticleStatus();
            });
            
            if(detectInfo != 0){
                return ;
            }
    
            const navigatorJSHandlePromise = page.evaluateHandle(() => {
                return window.FetchServiceMpArticleEvaluateHandleHelper.getUserAgent();
            });
    
            const imgJSHandlePromise = page.evaluateHandle(() => {
                return window.FetchServiceMpArticleEvaluateHandleHelper.getMpImgList();
            });

            const pageHTMLJSHandlePromise = page.evaluateHandle(() => {
                return window.FetchServiceMpArticleEvaluateHandleHelper.getMainHTML();
            });
            
            const htmlEvaluateResult = await Promise.all([
                navigatorJSHandlePromise,
                imgJSHandlePromise,
                pageHTMLJSHandlePromise
            ]);


            console.log("imageListDownloadedPromise now");

            /*
            const imageListDownloadedPromise = this._downloadImageFromEvaluateResult(articleMeta, htmlEvaluateResult[0], htmlEvaluateResult[1]);

            const scrollEvaluatePromise = page.evaluate(() => {
                return window.FetchServiceMpArticleEvaluateHandleHelper.scrollFullPage();
            });


            const parallResultForImage = await Promise.allSettled([
                imageListDownloadedPromise,
                scrollEvaluatePromise
            ]);

            const imageListDownloaded = parallResultForImage[0];
            */

            const imageListDownloaded = await this._downloadImageFromEvaluateResult(articleMeta, htmlEvaluateResult[0], htmlEvaluateResult[1]);

            console.log("imageListDownloadedPromise finish");

            await this._writeImageDownloadResult(articleMeta, imageListDownloaded);


            const HTMLData = await htmlEvaluateResult[2].jsonValue();
            articleMeta.title = HTMLData.title;

            await page.goto("about:blank");

            await page.addScriptTag({
                content: String(fs.readFileSync(BootstarpService.instance.getAppdir() + "/browser/script/base/BaseHelper.js")),
            });

            await page.addScriptTag({
                content: String(fs.readFileSync(BootstarpService.instance.getAppdir() + "/browser/script/mparticle/FetchServiceBlankPageEvaluateHandleHelper.js")),
            });

            const blankPrepare = await page.evaluate(() => {
                return window.FetchServiceBlankPageEvaluateHandleHelper.fixHTMLHead();
            });

            const finalHTMLResource = await page.evaluate((articleMeta, imageListDownloaded, HTMLData) => {
                window.FetchServiceBlankPageEvaluateHandleHelper.addHTML(articleMeta, imageListDownloaded, HTMLData);
                window.FetchServiceBlankPageEvaluateHandleHelper.clearScripts();
                return window.FetchServiceBlankPageEvaluateHandleHelper.getWholeHTML();
            }, articleMeta, imageListDownloaded, HTMLData);
            
            
            const writeResult = await this._writeData(articleMeta.save_dir + "/index-with-pics.html", finalHTMLResource);

            const finalHTMLResourceWithBlankImg = await page.evaluate(() => {
                window.FetchServiceBlankPageEvaluateHandleHelper.replaceAllImgToBlankImg();
                window.FetchServiceBlankPageEvaluateHandleHelper.clearScripts();
                return window.FetchServiceBlankPageEvaluateHandleHelper.getWholeHTML();
            });
            
            const writeResultBlankImgHTML = await this._writeData(articleMeta.save_dir + "/index-with-blank-pics.html", finalHTMLResourceWithBlankImg);

            const finalHTMLResourceWithoutImg = await page.evaluate(() => {
                window.FetchServiceBlankPageEvaluateHandleHelper.replaceAllImgToFilename();
                window.FetchServiceBlankPageEvaluateHandleHelper.clearScripts();
                return window.FetchServiceBlankPageEvaluateHandleHelper.getWholeHTML();
            });
            
            
            const writeResultNoImgHTML = await this._writeData(articleMeta.save_dir + "/index-only-text.html", finalHTMLResourceWithoutImg);

            articleMeta.success = true;

            const articleMetaWrite = JSON.parse(JSON.stringify(articleMeta));
            delete articleMetaWrite.save_dir;

            const writeResultMeta = await this._writeData(articleMeta.save_dir + "/metadata.js", JSON.stringify(articleMetaWrite));

            fs.appendFileSync(
                mpArticleSaveRoot + "/article-list-meta.txt",
                [                    
                    articleMeta.save_date + " " + articleMeta.save_time,
                    articleMeta.save_dir,
                    articleMeta.url,
                    articleMeta.title,
                ].join("\t") + "\r\n"
            );

        }catch(e){
            throw e;
        }finally{
            console.log("finally fetch finish");
            try{
                await browserContextInstance.close();
            }catch(e){
                console.error(e);
            }
        }


    }

    async _writeImageDownloadResult(articleMeta, imageListDownloaded){
        const result = [];
        const failedResult = [];
        for(let i = 0; i < imageListDownloaded.length; i++){
            let row = imageListDownloaded[i];
            let resultSingle = [
                row.success ? "下载成功" : "下载失败",
                row.name,
                row.filename ? row.filename : "[下载失败没有文件名]",
                row.url,
            ];
            result.push(resultSingle.join("\t"));

            if(!row.success){
                failedResult.push(resultSingle.join("\t"));
            }
        }

        await this._writeData(articleMeta.save_dir + "/image-download-all-result.txt", result.join("\r\n"));
        if(failedResult.length > 0){
            await this._writeData(articleMeta.save_dir + "/image-download-failed-result.txt", failedResult.join("\r\n"));
        }
    }

    _writeData(filepath, bufferData){
        return new Promise((resolve, reject) => {
            fs.writeFile(filepath, bufferData, (err) => {
                if (err){
                    resolve({
                        success: false,
                        exception: err,
                    });
                    return ;
                }

                resolve({
                    success: true,
                    exception: err,
                });

                return ;

            });
        });

    }


    async _downloadImageFromEvaluateResult(articleMeta, navigatorJSHandle, imgJSHandle){

        const navigatorInfo = await navigatorJSHandle.jsonValue();

        const imageDownloadDefaultOptions = {
            headers: {
                Referer: articleMeta.url,
                "user-agent": navigatorInfo.userAgent
            },
            timeout: 20000,
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

        ImageDownloadServiceInstance.eventEmitter.on("single-image-downloading", function(data){
            console.log("Downloading one image. Try #" + data.currentTryCount + ": " + data.url);
        });

        ImageDownloadServiceInstance.eventEmitter.on("batch-image-downloading-finish-one", function(data){
            console.log("Downloading multi image. Finish progress " + (data.finishCount / data.total * 100) + "%");
        });


        const result = await ImageDownloadServiceInstance.downloadImagelist(imageNeedDownload, imageDownloadDefaultOptions);

        return result;

    }

}

export default FetchService;