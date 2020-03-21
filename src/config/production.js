module.exports = {
    playwrightChromiumLaunchDefault : {
        executablePath: "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe"     //Chrome或者Chromium可执行目录
    },
    imageDownload: {
        dir_path: __dirname + "/../../runtime/images",
        url_prefix: "./images/",
    },
    mpArticleSave:{
        dir_path: __dirname + "/../../runtime/mp-article"     //保存微信公众号文章的目录
    }
};