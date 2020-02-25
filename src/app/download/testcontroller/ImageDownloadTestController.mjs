import ImageDownloadService from "../service/ImageDownloadService.mjs";

class ImageDownloadTestController{

    async testOneDownload(){

      const ImageDownloadServiceInstance = new ImageDownloadService();
      const result = await ImageDownloadServiceInstance.downloadImage(
          "https://mmbiz.qpic.cn/sz_mmbiz_gif/Jl3k5bflRCDk0gibq2XneVvD7XWdGVhyXoAxZJTKeCGSJ2cyMrBQe8m7yckcibHlTQzG9nO3OlA5byEwWuaou2uA/640?wx_fmt=gif",
          {
              headers: {
                  Referer: "https://mp.weixin.qq.com/s/thmgro6No8MYLtvlT_iu0A"
              }
          }
      );

      return result;

    }

}


export default ImageDownloadTestController;