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

        //return browser;

        browser._originCloseMethod = browser.close;

        LimitRunTimerService.attachNewToInstance(browser);
        browser.limitRunTimerServiceInstance.onReachEndtimeEvent = async function(){
            console.log("a browser is closing...");


            let contextCloseFunction = async function(context){

                try{
                    await context.close.apply(context);
                }catch(e){
                    console.error(e);
                }
            };

            try{
                let contexts = await browser.contexts();
                for(let i = 0; i < contexts.length; i++){
                    await contextCloseFunction(contexts[i]);
                }
            }catch(e){
                console.error(e);
            }


            await browser._originCloseMethod();
        };

        browser.close = async function(){
            await browser.limitRunTimerServiceInstance.runReachEndtime.apply(browser.limitRunTimerServiceInstance);
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

        //return context;

        context._originCloseMethod = context.close;

        LimitRunTimerService.attachNewToInstance(context);
        context.limitRunTimerServiceInstance.onReachEndtimeEvent = async function(){
            console.log("a browser context is closing...");


            let pageCloseFunction = async function(page){

                try{
                    await page.close.apply(page);
                }catch(e){
                    console.error(e);
                }
            };

            try{
                let pages = await context.pages();
                for(let i = 0; i < pages.length; i++){
                    await pageCloseFunction(pages[i]);
                }
            }catch(e){
                console.error(e);
            }

            await context._originCloseMethod();
        };

        context.close = async function(){
            await context.limitRunTimerServiceInstance.runReachEndtime.apply(context.limitRunTimerServiceInstance);
        };
        context.limitRunTimerServiceInstance.keepAliveTime = limitRuntime;

        return context;

    }

    static async createPage(contextInstance, url, limitRuntime){

        limitRuntime = limitRuntime || 0;

        const page = await contextInstance.newPage();

        //return page;

        page._originCloseMethod = page.close;

        LimitRunTimerService.attachNewToInstance(page);
        page.limitRunTimerServiceInstance.onReachEndtimeEvent = async function(...args){
            console.log("a page is closing...");
            page._originCloseMethodReturn = null;
            page._originCloseMethodReturn = await page._originCloseMethod.apply(page, args);
        };
        page.limitRunTimerServiceInstance.keepAliveTime = limitRuntime;
        page.close = async function(...args){
            await page.limitRunTimerServiceInstance.runReachEndtime.apply(page.limitRunTimerServiceInstance, args);
            return page._originCloseMethodReturn;
        };

        if(url){
            await page.goto(url);
        }

        return page;

    }


}

export default PlaywrightHelper;