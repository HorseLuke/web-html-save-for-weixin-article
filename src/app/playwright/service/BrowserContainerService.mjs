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

    constructor(browser, closeHandler){
        this.browser = browser;
        this.closeHandler = null;
        this.setCloseHandler(closeHandler);
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

    async close(){
        if(this.browser == null){
            return 0;
        }

        do{
            if(this.closeHandler == null){
                break;
            }

            try{
                let closeResult = this.closeHandler.apply(this.browser, [this.browser]);
                if(closeResult instanceof Promise){
                    await closeResult;
                }
            }catch(e){
                console.error("close handler error:");
                console.error(e);
            }

        }while(false);

        try{
            await this.browser.close();
            return 0;
        }catch(e){
            console.error(e);
            return -1;
        }

    }

}

export default BrowserContainerService;