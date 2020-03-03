import ImageDownloadService from "../../../../../src/app/download/service/ImageDownloadService.mjs";



describe('ImageDownloadService', function() {

    it('Test down one', async function() {

        this.timeout(30000); //30秒

        const ImageDownloadServiceInstance = new ImageDownloadService();
        const result = await ImageDownloadServiceInstance.downloadImage(
            "https://mmbiz.qpic.cn/sz_mmbiz_gif/Jl3k5bflRCDk0gibq2XneVvD7XWdGVhyXoAxZJTKeCGSJ2cyMrBQe8m7yckcibHlTQzG9nO3OlA5byEwWuaou2uA/640?wx_fmt=gif",
            {
                headers: {
                    Referer: "https://mp.weixin.qq.com/s/thmgro6No8MYLtvlT_iu0A"
                }
            }
        );
  
        console.log(result);


        if(result.success){
            return ;
        }
        return new Error("result not success");

    });



});
