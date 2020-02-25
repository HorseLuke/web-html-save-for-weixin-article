import FetchService from "../service/FetchService.mjs";

class FetchOneArticleTestController{

    async testWithMultiPic(){
        const FetchServiceInstance = new FetchService();
        //await FetchServiceInstance.fetch("https://mp.weixin.qq.com/s/_YytdfU10FUvq65NDr_OqQ");
        const result = await FetchServiceInstance.fetch("https://mp.weixin.qq.com/s/thmgro6No8MYLtvlT_iu0A");
        //const result = await FetchServiceInstance.fetch("https://mp.weixin.qq.com/s/ddd");
        return result;
    }

}

export default FetchOneArticleTestController;