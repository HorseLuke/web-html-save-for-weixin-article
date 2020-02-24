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
    
    async downloadImagelist(imglist, options){

        var result = [];

        try{


        }catch(e){
            return result;
        }

    }


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