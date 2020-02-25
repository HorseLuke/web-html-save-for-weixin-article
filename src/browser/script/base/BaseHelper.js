(function(name){

    let helper = {};

    helper.checkUrlIsInHostList = function(url, hosts){

        try{
            
            let hostsReal = [];
            for(let i = 0; i < hosts.length; i++){
                hostsReal.push("https://" + hosts[i] + "/");
                hostsReal.push("http://" + hosts[i] + "/");
            }
    
            for(let v = 0; v < hostsReal.length; v++){
                if(url.indexOf(hostsReal[v]) == 0){
                    return 0;
                }
            }
    
            return -1;

        }catch(e){
            console.error(e);
            return -1;
        }



    };


    helper.generateRandomStr = function(len){
        len = len || 32;
        var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
        var maxPos = $chars.length;
        var pwd = '';
        for (i = 0; i < len; i++) {
            pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return pwd;
    };


    helper.createSafeText = function(text){
        var a = document.createElement("span");
        a.innerText = text;
        return a.innerHTML;
    };

    window[name] = helper;

})("xHelperFunctionInBrowserContext");