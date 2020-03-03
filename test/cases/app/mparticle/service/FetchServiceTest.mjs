import FetchService from "../../../../../src/app/mparticle/service/FetchService.mjs";



describe('FetchService', function() {

    it('Test multi pic', async function() {
        this.timeout(60000); //60秒
        const url = "https://mp.weixin.qq.com/s/CPMybFyhgdGVV9gR6RSdDA";   //25MB多图
        const FetchServiceInstance = new FetchService();
        const result = await FetchServiceInstance.fetch(url);
        
        console.log(result);

        if(result.success){
            return ;
        }
        return new Error("result not success");
    });

    
    it('Test NOT EXISTS', async function() {
        this.timeout(60000); //60秒
        const url = "https://mp.weixin.qq.com/s/ddd";
        const FetchServiceInstance = new FetchService();
        const result = await FetchServiceInstance.fetch(url);
        
        console.log(result);

        if(!result.success){
            return ;
        }
        return new Error("result unexpected success");
    });


});

