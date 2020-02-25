(function(name){

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
            if(!row.success){
                continue;
            }

            let imgSelected = document.querySelector("img[data-x-replace-token='" + row["unique-id"] + "']");
            if(imgSelected == null){
                continue;
            }

            imgSelected.setAttribute("src", row.saveurl);
            imgSelected.setAttribute("data-x-download-success", 1);
            imgSelected.setAttribute("data-x-download-filename", row.filename);

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

    window[name] = helper;

})("FetchServiceBlankPageEvaluateHandleHelper");