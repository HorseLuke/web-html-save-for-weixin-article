(function(name){

    let helper = {};

    helper.detectArticleStatus = function(){
        try{
            document.querySelector(".rich_media_title").innerText;
            return 0;
        }catch(e){
            return -1;
        }
    };

    helper.getUserAgent = function(){
        return {
            userAgent: navigator.userAgent
        };
    };

    helper.getMpImgList = function(){
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
    };

    helper.getMainHTML = function(){
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
    };

    window[name] = helper;

})("FetchServiceMpArticleEvaluateHandleHelper");