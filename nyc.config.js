//https://github.com/istanbuljs/nyc/blob/master/nyc.config.js

module.exports = {
    all: true,
    "report-dir": "R:/TEMP/",
    "temp-dir": "R:/TEMP/fff",
    reporter: [
        "html"
    ],
    extension: [
        ".js",
        ".cjs",
        ".mjs"
    ],
    include: [
        "src/**/*.*",
    ],
    exclude:[
        "test/**/*.*"
    ],
};