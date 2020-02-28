const CommonJsCompatHelper = {};

CommonJsCompatHelper.require = function(str){
    return require(str);
};

CommonJsCompatHelper.requireFromAppdir = function(filepath){
    return require(global.BootstarpInstance.getAppdir() + "/" + filepath);
};

module.exports = CommonJsCompatHelper;
