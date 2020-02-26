(function(name){

    const downloadFailedImage = "data:image/png;base64,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";

    let helper = {};

    helper.fixHTMLHead = function(){
        let head = document.getElementsByTagName("head")[0];
        head.innerHTML = head.innerHTML + `
        <meta charset=utf-8>
        <meta http-equiv=X-UA-Compatible content="IE=edge">
        <meta name=viewport content="width=device-width,initial-scale=1,user-scalable=no">
        <style>
        
        body{
            line-height: 1.6;
            font-family: -apple-system-font,BlinkMacSystemFont,"Helvetica Neue","PingFang SC","Hiragino Sans GB","Microsoft YaHei UI","Microsoft YaHei",Arial,sans-serif;
            font-size: 16px;
        }

        .x-article-main-container {
            width: 100%;
        }

        .x-title-container{
            font-weight: bold;
        }

        @media screen and (min-width: 1024px){
            .x-article-main-container {
                max-width: 677px;
                margin-left: auto;
                margin-right: auto;
            }
        }

        </style>
        `;
        return 0;
    };

    helper.addHTML = function(articleMeta, imageListDownloaded, HTMLData){

        document.title = HTMLData.title;
        let body = document.getElementsByTagName("body")[0];
        body.innerHTML = `
        <div class="x-save-time-container">保存时间：<div id="x-save-time-id"></div></div>
        <div class="x-save-url-container">地址：<div id="x-save-url-id"></div></div>
        <div><hr /></div>
        <div class="x-article-main-container">
            <div class="x-title-container"><div id="x-title-id"></div></div>
            <div class="x-author-container"></div>
            <div><hr /></div>
            <div class="x-content-container"></div>
        </div>
        `;

        document.getElementById("x-title-id").innerText = HTMLData.title;
        document.getElementById("x-save-url-id").innerText = articleMeta.url;
        document.getElementById("x-save-time-id").innerText = articleMeta.save_date + " " + articleMeta.save_time;
        document.getElementById("x-save-time-id").innerText = articleMeta.save_date + " " + articleMeta.save_time;
        document.querySelector(".x-author-container").innerHTML = HTMLData.authorHtml;
        document.querySelector(".x-content-container").innerHTML = HTMLData.contentHtml;

        try{
            helper.replaceAllImages(imageListDownloaded);
        }catch(e){
            console.error(e);
        }
        

        return 0;
    };


    helper.replaceAllImages = function(imageListDownloaded){
        for(let i=0; i<imageListDownloaded.length; i++){
            let row = imageListDownloaded[i];

            let imgSelected = document.querySelector("img[data-x-replace-token='" + row["unique-id"] + "']");
            if(imgSelected == null){
                continue;
            }

            if(imgSelected.hasAttribute("crossorigin")){
                imgSelected.removeAttribute("crossorigin");
            }
            
            if(row.success){
                imgSelected.setAttribute("src", row.saveurl);
                imgSelected.setAttribute("data-x-download-success", 1);
                imgSelected.setAttribute("data-x-download-filename", row.filename);
            }else{
                imgSelected.setAttribute("src", downloadFailedImage);
                imgSelected.setAttribute("data-x-download-success", 0);
                imgSelected.setAttribute("data-x-download-filename", row.name);
            }



        }
    };

    helper.clearScripts = function(){
        let allScripts = document.querySelectorAll("script");

        for(let i = 0 ; i < allScripts.length; i++){
            allScripts[i].remove();
        }
    };

    helper.getWholeHTML = function(){
        return document.getElementsByTagName("html")[0].outerHTML;
    };

    helper.replaceAllImgToFilename = function(){
        helper.replaceAllSuccessImgToFilename();
        helper.replaceAllFailedImgToFilename();
    };

    helper.replaceAllSuccessImgToFilename = function(){

        let imglist = document.querySelectorAll("img[data-x-download-success='1']");

        for(let i = 0 ; i < imglist.length; i++){
            let img = imglist[i];
            let filename = img.getAttribute("data-x-download-filename");

            let newDom = document.createElement("span");
            newDom.setAttribute("data-x-was-img", 1);
            newDom.setAttribute("data-x-img-file-name", filename);
            newDom.style.backgroundColor = "#FF9800";
            newDom.style.color = "white";
            newDom.style.fontWeight="bold";
            newDom.style.margin = "30px 0";
            newDom.style.padding = "30px 0";
            newDom.innerText = filename;

            img.replaceWith(newDom);
        }
    };

    helper.replaceAllFailedImgToFilename = function(){

        let imglist = document.querySelectorAll("img[data-x-download-success='0']");

        for(let i = 0 ; i < imglist.length; i++){
            let img = imglist[i];
            let filename = "[DOWNLOAD_FAILED!]" + img.getAttribute("data-x-download-filename");

            let newDom = document.createElement("span");
            newDom.setAttribute("data-x-was-img", 1);
            newDom.setAttribute("data-x-img-file-name", filename);
            newDom.style.backgroundColor = "red";
            newDom.style.color = "white";
            newDom.style.fontWeight="bold";
            newDom.style.margin = "30px 0";
            newDom.style.padding = "30px 0";
            newDom.innerText = filename;

            img.replaceWith(newDom);
        }
    };


    window[name] = helper;

})("FetchServiceBlankPageEvaluateHandleHelper");