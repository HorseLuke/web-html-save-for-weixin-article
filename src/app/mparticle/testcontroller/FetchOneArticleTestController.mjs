import FetchService from "../service/FetchService.mjs";

class FetchOneArticleTestController{

    async testWithMultiPic(){


        //const url = "https://mp.weixin.qq.com/s/_YytdfU10FUvq65NDr_OqQ";
        //const url = "https://mp.weixin.qq.com/s/thmgro6No8MYLtvlT_iu0A";
        //const url = "https://mp.weixin.qq.com/s/ddd";
        //const url = "https://mp.weixin.qq.com/s/CPMybFyhgdGVV9gR6RSdDA";   //25MB多图
        //const url = "https://mp.weixin.qq.com/s/XwL0MZAWpT9c_JdiyPG96A";
        //const url = "https://mp.weixin.qq.com/s/103UMlt_LO0ZS-2XJz-fvw";  //多张gif图
        const url = "https://mp.weixin.qq.com/s/8eWr51-P1A6sqS0pO6Zijw";  //多图

        const FetchServiceInstance = new FetchService();
        const result = await FetchServiceInstance.fetch(url);

        return result;
    }

}

export default FetchOneArticleTestController;