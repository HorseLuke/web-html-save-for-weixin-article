import config from "config";
import merge from "merge";
import * as playwright from "playwright-core";

/**
 * Playwright保存Browser实体，以方便后续进行主动关闭调用
 */
class BrowserContainerService{

    static async createInstanceByConfigName(browserType, configName){
        const launchOptions = config.get(configName);
        return BrowserContainerService.createInstanceByConfig(browserType, launchOptions);
    }

    static async createInstanceByConfig(browserType, launchOptions){
        const browser = await playwright.default[browserType].launch(launchOptions);
        const BrowserContainerInstance = new BrowserContainerService(browser);
        return BrowserContainerInstance;
    }

    constructor(browser){
        this.browser = browser;
        this.closeHandler = null;
        this.createTime = new Date();
        this.keepAliveTimeout = 0;
        this.keepAliveTimeoutHandler = null;
    }

    getBrowser(){
        return this.browser;
    }

    async createNewContextAndPage(url, configNew){
        let config = {
            locale: "zh-CN",
            timezoneId: "Asia/Shanghai",
        };

        if(configNew){
            config = merge.recursive(true, config, configNew);
        }

        const context = await this.browser.newContext(config);

        const page = await context.newPage();
        if(url){
            await page.goto(url);
        }

        return page;

    }

    setCloseHandler(closeHandler){
        this.closeHandler = closeHandler ? closeHandler : null;
    }

    /**
     * 设置运行超时时间
     * @param timeout int 0表示永远不超时，一直运行
     */
    setKeepAliveTimeout(timeout){
        if(this.keepAliveTimeoutHandler != null){
            clearTimeout(this.keepAliveTimeoutHandler);
        }
        this.keepAliveTimeout = timeout;
        if(this.keepAliveTimeout > 0){
            this.keepAliveTimeoutHandler = setTimeout(() => {
                this.close();
            }, this.keepAliveTimeout);
        }
    }

    async close(){

        if(this.keepAliveTimeoutHandler != null){
            clearTimeout(this.keepAliveTimeoutHandler);
        }

        if(this.browser == null){
            return 0;
        }

        do{
            if(this.closeHandler == null){
                break;
            }

            try{
                let closeResult = this.closeHandler.apply(this, [this.browser]);
                if(closeResult instanceof Promise){
                    await closeResult;
                }
            }catch(e){
                console.error("close handler error:");
                console.error(e);
            }

        }while(false);

        try{
            const browserOld = this.browser;
            this.browser = null;
            await browserOld.close();
            return 0;
        }catch(e){
            console.error(e);
            return -1;
        }

    }

}

export default BrowserContainerService;