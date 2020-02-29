import LimitRunTimerService from "../../base/service/LimitRunTimerService.mjs";
import config from "config";
import merge from "merge";
import * as playwright from "playwright-core";

class PlaywrightHelper{

    static async createBrowserByConfigName(browserType, configName, limitRuntime){
        const launchOptions = config.get(configName);
        return PlaywrightHelper.createBrowserByConfig(browserType, launchOptions, limitRuntime);
    }

    static async createBrowserByConfig(browserType, launchOptions, limitRuntime){
        limitRuntime = limitRuntime || 0;
        const browser = await playwright.default[browserType].launch(launchOptions);
        LimitRunTimerService.attachNewToInstance(browser);
        browser.limitRunTimerServiceInstance.onReachEndtimeEvent = async () => {
            await browser.close();
        };
        browser.limitRunTimerServiceInstance.keepAliveTime = limitRuntime;
        return browser;
    }

    static async createBrowserContext(browserInstance, configNew, limitRuntime){

        limitRuntime = limitRuntime || 0;

        let config = {
            locale: "zh-CN",
            timezoneId: "Asia/Shanghai",
        };

        if(configNew){
            config = merge.recursive(true, config, configNew);
        }

        const context = await browserInstance.newContext(config);
        LimitRunTimerService.attachNewToInstance(context);
        context.limitRunTimerServiceInstance.onReachEndtimeEvent = async () => {
            await context.close();
        };
        context.limitRunTimerServiceInstance.keepAliveTime = limitRuntime;

        return context;

    }

    static async createPage(contextInstance, url, limitRuntime){

        limitRuntime = limitRuntime || 0;

        const page = await contextInstance.newPage();

        LimitRunTimerService.attachNewToInstance(page);
        page.limitRunTimerServiceInstance.onReachEndtimeEvent = async () => {
            await page.close();
        };
        page.limitRunTimerServiceInstance.keepAliveTime = limitRuntime;

        if(url){
            await page.goto(url);
        }

        return page;

    }


}

export default PlaywrightHelper;