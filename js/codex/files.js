var fs = require('fs');
var glob = require("glob");
var readline = require('readline');

exports.findJsFiles = function (jsPath) {

    var globPatten = jsPath + '/**/*.+(js|jsx)';

    console.log("searching for js files", globPatten);

    var jsFiles = glob.sync(globPatten);
    return jsFiles
};

exports.fileLinesAtRange = function (filePath, x, y) {

    console.log("looking at file", filePath, "start", x, "end", y);

    var lineReader = readline.createInterface({
        input: fs.createReadStream(filePath)
    });

    var fileLines = fs.readFileSync(filePath)
        .toString()
        .split("\n");

    var lines = [];
    for (i in fileLines) {
        //console.log(i, x, y, i >= x && i <= y);
        if (i >= x && i <= y) {
            lines.push(fileLines[i]);
        }
    }

    return lines.join("\n");
};