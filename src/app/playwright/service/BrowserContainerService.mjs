import config from "config";
import * as playwright from "playwright-core";

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