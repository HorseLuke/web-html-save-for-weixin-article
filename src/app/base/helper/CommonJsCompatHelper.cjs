/**
 * Node.js的Common JS模块方式兼容
 * @var {CommonJsCompatHelper}
 */
const CommonJsCompatHelper = {};

/**
 * 使用Node.js的Common JS模块方式导入Common JS模块。
 * @see https://nodejs.org/api/modules.html#modules_require_id
 * @param {string} filepath module name or path
 * @return {any} exported module content
 */
CommonJsCompatHelper.require = function(str){
    return require(str);
};

/**
 * 使用Node.js的Common JS模块方式导入appdir目录下的文件（主要是.cjs文件）。
 * 注意：
 *     此方法需要BootstarpService单例化并挂载到global.BootstarpInstance后才能使用。
 * @param {string} filepath appdir目录下的文件路径
 * @return {any} exported module content
 */
CommonJsCompatHelper.requireFromAppdir = function(filepath){
    return require(global.BootstarpInstance.getAppdir() + "/" + filepath);
};

module.exports = CommonJsCompatHelper;
