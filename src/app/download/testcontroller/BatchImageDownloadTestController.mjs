import ImageDownloadService from "../service/ImageDownloadService.mjs";


class BatchImageDownloadTestController{

    async testBatch(){
        let picList = [
            {
              'url': 'https://mmbiz.qpic.cn/sz_mmbiz_gif/Jl3k5bflRCBo2n5KCL80xT0wh4HQicNCudAQvBAluwIW3Kx7qgnYmMouVvmxwyDicG6etXAjQWNzpiaOdibb7bDrfg/640?wx_fmt=gif',
              options: {
                "unique-id": "1-DnkWB2fZAT2cfyFn", 
                save: { 
                    name: "1-DnkWB2fZAT2cfyFn"
                }
              },
            },
            {
              'url': 'https://mmbiz.qpic.cn/mmbiz_png/YUyZ7AOL3ony3BHsMvrBYHq1FUFSgRrbxFqlOe0FxjXPkpAmEm8EsazaLrUPSicKcHchYdTYV6lallbFNO2CiaibQ/640?wx_fmt=png',
              options: {
                save: { 
                    name: "2-TEFYcfF5nPSEySDN"
                }
              },
            },
            {
              'url': 'https://mmbiz.qpic.cn/sz_mmbiz_png/Jl3k5bflRCDk0gibq2XneVvD7XWdGVhyXDm4yLjSnbsIzibwia4h4rIchSxAzGkn3xkcVNImjEhdkG4OkhltAAeNA/640?wx_fmt=png'
            },
            {
              'url': 'https://mmbiz.qpic.cn/mmbiz_png/YUyZ7AOL3ony3BHsMvrBYHq1FUFSgRrbxFqlOe0FxjXPkpAmEm8EsazaLrUPSicKcHchYdTYV6lallbFNO2CiaibQ/640?wx_fmt=png'
            },
            {
              'url': 'https://mmbiz.qpic.cn/sz_mmbiz_gif/Jl3k5bflRCDk0gibq2XneVvD7XWdGVhyXoAxZJTKeCGSJ2cyMrBQe8m7yckcibHlTQzG9nO3OlA5byEwWuaou2uA/640?wx_fmt=gif'
            },
          ];


          const ImageDownloadServiceInstance = new ImageDownloadService();
          const result = await ImageDownloadServiceInstance.downloadImagelist(
              picList,
              {
                  headers: {
                      Referer: "https://mp.weixin.qq.com/s/thmgro6No8MYLtvlT_iu0A"
                  }
              }
            );
          return result;

    }

}


export default BatchImageDownloadTestController;