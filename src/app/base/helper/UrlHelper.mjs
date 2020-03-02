import {parse as urlParse} from "url";

/**
 * 检查某个url是否在指定的域名列表白名单中
 * 
 * @example
 *     checkUrlIsInHostList("http://www.aaa.com/asdgg/dasfg", ["www.aaa.com", "www.bbb.com"]); //0
 * 
 * @param {string} urlParam url路径 
 * @param {Array} whiteHostList 域名列表白名单
 * @return {number} 0：检查通过；-1：检查不通过；-2：报错
 */
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