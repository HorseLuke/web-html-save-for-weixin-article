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
        browser._originCloseMethod = browser.close;

        LimitRunTimerService.attachNewToInstance(browser);
        browser.limitRunTimerServiceInstance.onReachEndtimeEvent = async function(){
            console.log("a browser is closing...");
            await browser._originCloseMethod();
        };
        browser.close = async function(){
            await browser.limitRunTimerServiceInstance.runReachEndtime();
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
        context._originCloseMethod = context.close;

        LimitRunTimerService.attachNewToInstance(context);
        context.limitRunTimerServiceInstance.onReachEndtimeEvent = async function(){
            console.log("a browser context is closing...");
            await context._originCloseMethod();
        };
        context.close = async function(){
            await context.limitRunTimerServiceInstance.runReachEndtime();
        };
        context.limitRunTimerServiceInstance.keepAliveTime = limitRuntime;

        return context;

    }

    static async createPage(contextInstance, url, limitRuntime){

        limitRuntime = limitRuntime || 0;

        const page = await contextInstance.newPage();
        page._originCloseMethod = page.close;

        LimitRunTimerService.attachNewToInstance(page);
        page.limitRunTimerServiceInstance.onReachEndtimeEvent = async function(){
            console.log("a page is closing...");
            await page._originCloseMethod();
        };
        page.limitRunTimerServiceInstance.keepAliveTime = limitRuntime;
        page.close = async function(){
            await page.limitRunTimerServiceInstance.runReachEndtime();
        };

        if(url){
            await page.goto(url);
        }

        return page;

    }


}

export default PlaywrightHelper;