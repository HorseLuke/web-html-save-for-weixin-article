import FetchService from "../service/FetchService.mjs";

class FetchClicontroller{


    async actionFetch(argv){
        
        if(!argv.url){
            throw new Error("Please pass url in argv. Example -- --url=http://aaa.com");
        }

        let timeout = parseInt(argv.timeout);

        if(!Number.isInteger(argv.timeout)){
            timeout = 120;
        }

        const FetchServiceInstance = new FetchService();
        const result = await FetchServiceInstance.fetch(argv.url, timeout * 1000);

        return result;

    }

}


export default FetchClicontroller;