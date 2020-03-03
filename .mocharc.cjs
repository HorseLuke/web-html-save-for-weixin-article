//https://github.com/mochajs/mocha/tree/master/example/config
//https://mochajs.org/api/mocha
//https://boneskull.com/mocha-v6/

module.exports = {
    extension: [
        ".js",
        ".cjs",
        ".mjs"
    ],
    file: [
        "./test/mocha-root-level-hook.mjs"
    ],
    delay: true, //Delay initial execution of root suite
    spec: [
        "./test/cases/**/*Test.mjs"
    ]
};