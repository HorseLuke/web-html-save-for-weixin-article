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

        if(result.success == true){
            return ;
        }
        
        throw new Error("result not success");

    });


    it('Test down multi', async function() {
        let picList = [
            {
              'url': 'http://baidulogo.bj.bcebos.com/logo/7yeju1jeojng9xk624o90am666d7vx13.gif',
              options: {
                "unique-id": "1-DnkWB2fZAT2cfyFn", 
                save: { 
                    name: "1-DnkWB2fZAT2cfyFn"
                }
              },
            },
            {
              'url': 'http://baidulogo.bj.bcebos.com/editor/vdu2e0krg5ja2y0pt1ae6ippkg5q4ro0.jpg',
              options: {
                save: { 
                    name: "2-TEFYcfF5nPSEySDN"
                }
              },
            },
            {
              'url': 'http://baidulogo.bj.bcebos.com/editor/9yecwjxl0fjf6oa7673g2mvnjc8er3r0.jpg'
            }
          ];


        const ImageDownloadServiceInstance = new ImageDownloadService();
        const result = await ImageDownloadServiceInstance.downloadImagelist(
              picList,
              {
                  headers: {
                      Referer: "https://logo.baidu.com/show/view/310"
                  }
              }
        );

        let successCount = 0;
        for(let i = 0; i < result.length; i++){
            if(result[i].success == true){
                successCount++;
            }
        }

        console.log(result);

        if(successCount == result.length){
            return ;
        }
        
        throw new Error("result not success. " + (successCount - result.length) + " failed");
        

    });

});
