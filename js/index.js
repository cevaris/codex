#!/usr/bin/env node

const util = require('util');
var acorn = require('acorn-jsx');
var fs = require('fs');
var glob = require("glob");
var program = require('commander');


/**
 *
 * /git/redux/examples/async/components/Picker.js
 * /git/redux/examples/async/actions/index.js
 */

function parseJsFile(jsFile) {
    console.log("parsing file ", jsFile);

    var content = fs.readFileSync(jsFile);

    var ast = acorn.parse(content, {
        locations: true,
        sourceType: "module",
        sourceFile: jsFile,
        plugins: {
            jsx: true
        }
    });

    //console.log(ast)
    //console.log(util.inspect(ast, false, null));
}

function handlePath(jsPath) {

    try {
        if (!fs.existsSync(jsPath)) {
            console.log(jsPath, "does not exist");
            process.exit();
        }


        var stats = fs.lstatSync(jsPath);
        if (stats.isFile()) {
            parseJsFile(jsPath);
            process.exit();
        }

    } catch (err) {
        console.log(err);
        process.exit();
    }

    var globPatten = jsPath + '/**/*.+(js|jsx)';

    console.log(globPatten);

    glob(globPatten, function (err, files) {

        for (i in files) {
            try {
                parseJsFile(files[i]);
            } catch (err) {
                console.log('could not parse:', files[i], err);
            }
        }
    });
}


program
    .command('parse <path>')
    .action(handlePath);

program
    .parse(process.argv);

