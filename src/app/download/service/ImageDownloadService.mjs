import * as fs from "fs";
import config from "config";
import fetch from "node-fetch";
import merge from "merge";
import imageTypeDetect from "image-type";
import randomstring from "randomstring";

class ImageDownloadService{

    constructor(){
        this.allowImgExt = ["jpg", "jpeg", "png", "gif", "webp"];
    }
    
    /**
     * 批量下载图片
     * @param list Array [
     *     {url: "xxx", options: {}}
     * ]
     * @param defaultOptions Object
     * @return Promise 
     */
    downloadImagelist(imglist, defaultOptions){

        //其实可以使用Promise.allSettled。但此处暂不使用，主要研究并发处理。

        return new Promise((resolve, reject) => {
            
            var returnResult = [];
            
            if(imglist.length < 1){
                resolve(returnResult);
                return ;
            }

            let processed = 0;
            const totalCount = imglist.length;

            var internalDownloadImageRun = async (i, urlForInternal, optionsForInternal) => {
                let singleResult = await this.downloadImage(urlForInternal, optionsForInternal);
                //returnResult.push([i, urlForInternal, optionsForInternal, singleResult]);
                returnResult.push(singleResult);
                processed++;
                if(processed == totalCount){
                    resolve(returnResult);
                }
            };

            for(let i = 0 ; i < imglist.length; i++){
                let imgRow = imglist[i];
                let optionNew = {};
                if(imgRow.hasOwnProperty("options") && imgRow.options){
                    if(defaultOptions){
                        optionNew = merge.recursive(true, defaultOptions, imgRow.options);
                    }else{
                        optionNew = imgRow.options;
                    }
                }
                internalDownloadImageRun(i, imgRow.url, optionNew);
            }

        });

    }

    /**
     * 下载一张图片
     * @param url String
     * @param defaultOptions Object {
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.116 Safari/537.36"
                },
                timeout: 30000,
                save: {
                    name: "",
                    dir_path: saveDefault.dir_path,
                    url_prefix: saveDefault.url_prefix,
                }
     * }
     * @return Promise 
     */
    async downloadImage(url, options){
        const result = {
            "url": url,
            "success": false,
            "image-type": "",
            "filename": "",
            "filepath": "",
            "saveurl": "",
            "name": "",
            "unique-id": options["unique-id"] ? options["unique-id"] : "",
            "error": "",
        };

        try{

            let saveDefault = config.get("imageDownload");

            let optionsRun = {
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.116 Safari/537.36"
                },
                timeout: 30000,
                save: {
                    name: "",
                    dir_path: saveDefault.dir_path,
                    url_prefix: saveDefault.url_prefix,
                }
            };
    
            if(options){
                optionsRun = merge.recursive(true, optionsRun, options);
            }

            do{

                if(typeof optionsRun.save.name == "number"){
                    optionsRun.save.name = optionsRun.save.name.toString();
                }

                if(typeof optionsRun.save.name != "string"){
                    result.name = randomstring.generate(16);
                    break;
                }

                const pattern = new RegExp("^[a-z0-9\\-\\_]+$", "i");

                if(!pattern.test(optionsRun.save.name)){
                    result.name = randomstring.generate(16);
                    break;
                }

                result.name = optionsRun.save.name;

            }while(false);
            
            const res = await fetch(url, {
                method: "get",
                headers: optionsRun.headers
            });
    
            const buffer = await res.buffer();
            const imageTypeRes = imageTypeDetect(buffer);

            if(!imageTypeRes.hasOwnProperty("ext")){
                result.error = "NOT_IMAGE";
                return result;
            }

            const detectImageType = imageTypeRes.ext.toLocaleLowerCase();
            if(!this.allowImgExt.includes(detectImageType)){
                result.error = "NOT_ALLOWED_IMAGE_EXT";
                return result;
            }

            do{
                if(fs.existsSync(optionsRun.save.dir_path)){
                    break;
                }

                fs.mkdirSync(optionsRun.save.dir_path, {
                    recursive: true
                });

            }while(false);

            result.filename = result.name + "." + detectImageType;
            result["image-type"] = detectImageType;
            result.filepath = optionsRun.save.dir_path + "/" + result.filename;
            result.saveurl = optionsRun.save.url_prefix + "/" + result.filename;

            const writeResult = await (async(filepath, bufferData)=>{
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
            })(result.filepath, buffer);

            if(writeResult.success != true){
                result.error = "WRITE_ERROR_EXCEPTION";
                result.exception = writeResult.exception;
                return result;
            }
            
            result.success = true;
            return result;
    
    
        }catch(e){
            console.error(e);
            result.error = "UNKNOWN_EXCEPTION";
            result.exception = e;
            return result;
        }



    }



}


export default ImageDownloadService;