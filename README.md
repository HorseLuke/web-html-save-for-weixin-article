# 网页保存项目之微信公众号文章保存

## 简述

本项目用于在电脑上保存微信公众号文章（即mp.weixin.qq.com上的文章），方便媒体行业的编辑进行离线浏览、或进行进一步信息处理。

本项目目的是为了拯救编辑时间，也就是拯救编辑生命。

## 环境要求

  - 64位操作系统版本（暂时在Windows 10上测试通过）
  - Node.js >=13.8.0
  - npm >=6.0.0
  - Chrome >= 79

## 全新安装方法

（1）安装Chrome或者Chromium，并通过开始菜单，获取其可执行文件路径。

Windows一般为```C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe```。

（2）安装Node.js，请选择版本至少在13.8.0及以上。

（3）如有需要，配置cnpm以替代npm，加快下载速度。

详细见文档：https://developer.aliyun.com/mirror/NPM?from=tnpm

（4）git clone本项目，然后在本项目目录下执行如下命令。

```
npm install --save-dev
```

如果安装了cnpm，则使用

```
cnpm install --save-dev
```

（5）找到本项目的文件```./src/config.production.js```。

修改```playwrightChromiumLaunchDefault```下的参数```executablePath```，指向Chrome或者Chromium的可执行文件路径。

（本修改可选）修改```mpArticleSave```下的参数```dir_path```，可自定义文章默认保存目录。

若在Windows上填写文件目录路径，请使用双反斜杠，比如```C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe```。

## 运行

### 保存微信文章命令行

在本项目目录下，运行命令行

```
npm run app -- --router=mparticle/fetch/fetch --url="【mp.weixin.qq.com】" --timeout=【秒】
```

其中：

参数```url```为微信公众号文章url。

参数```timeout```为最长允许执行的保存时间，单位为秒。

例子：

```
npm run app -- --router=mparticle/fetch/fetch --url="https://mp.weixin.qq.com/s/R5lUNDDbghGfnwBir8srJw" --timeout=120
```

正常情况下，输出结果如下：

```
{
  id: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  url: 'https://mp.weixin.qq.com/s/R5lUNDDbghGfnwBir8srJw',    //该微信公众号文章url
  title: '微信开放平台移动应用 SDK 更新提醒',
  save_timestamp: 1584818172,
  save_date: '2020-03-22',
  save_time: '03:16:12',
  save_timecode: '031612',
  save_dir: 'xxxxxxxxxxxxx/runtime/mp-article/2020-03-22/031612_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',    //该微信公众号文章保存的最终目录
  success: true    //保存结果。false表示保存失败
}
```

该文章默认保存在项目目录下的```./runtime/mp-article/```，以当前保存日期分类。

若保存成功（success为true），文件夹有如下内容：

```
metadata.js：元数据
index-with-pics.html：带原图片的微信文章
index-with-blank-pics.html：以空白图片占位的微信文章。其中：绿色底表示对应的图片下载成功；红色底表示该图片下载失败
index-only-text.html：以下载图片文件名占位的微信文章。
image-download-all-result.txt：图片下载结果。若下载失败，编辑可自行复制对应url重新下载
（文件夹）images：下载的图片，按在文章出现的顺序编号命名。
```


## 其他命令行

有关命令行的具体参数，请参阅```package.json```下的```scripts```字段。

### 测试相关

（1）使用Mocha运行单元测试.

```
npm run test
```

（2）使用Mocha运行单元测试、同时调用c8运行代码覆盖测试。

代码覆盖结果在项目目录```./runtime/coverage-report/```。

```
npm run test-with-coverage
```

## 常见问题

（1）能否保存微信公众号里面的在看数、评论？

答：

不能。

本项目目的很明确，仅用于减轻媒体行业中普遍存在的编辑手动录稿负担，文章本身以外的信息不纳入考虑。

如有需要，请移步其它人开发的项目。


（2）能否自动批量保存某个微信公众号下面的所有历史文章？

答：

不能。用户必须一条条手动获取url然后保存。

如有需要，请移步其它人开发的项目。


## 开发资源

如需进一步了解本项目的原理，请参阅如下文档：

  - Node.js：https://nodejs.org/en/docs/
  - Playwright（微软出品，操作浏览器的Node库）：https://github.com/microsoft/playwright
  - Mocha（单元测试框架）：https://mochajs.org/
  - c8（代码覆盖测试）：https://github.com/bcoe/c8


## 其它

如果觉得拯救了您的时间，不妨给个赞赏（手动滑稽）。

![微信赞赏码](https://horseluke.github.io/Assets/img/weixin_zanshangcode.jpg)

