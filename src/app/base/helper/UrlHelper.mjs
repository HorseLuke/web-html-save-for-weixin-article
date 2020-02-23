import {parse as urlParse} from "url";

function checkUrlIsInHostList(urlParam, whiteHostList){

	try{
		let hostFull = urlParse(urlParam).hostname;
		let host = hostFull.split(":")[0];

		return whiteHostList.includes(host) ? 0 : -1;

	}catch(e){
		console.error(e);
		return -2;
    }
    
}

export {
    checkUrlIsInHostList
};