/**
 * 仅把全句的首字符串大写。
 * 比如：hello world改成Hello world
 * 
 * @param {string} str 
 * @return {string}
 */
function ucfirst(str){

    let a = str;
    if(typeof a != "string"){
        a = String(a);
    }

    return a.replace(a[0],a[0].toUpperCase());

}

/**
 * 仅把全句的首字符串小写。
 * 比如：Hello world改成hello world
 * 
 * @param {string} str 
 * @return {string}
 */
function lcfirst(str){

    let a = str;
    if(typeof a != "string"){
        a = String(a);
    }

    return a.replace(a[0],a[0].toLowerCase());

}

export {
    ucfirst,
    lcfirst
};