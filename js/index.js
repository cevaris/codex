#!/usr/bin/env node


var program = require('commander');
var fs = require('fs');

var filesUtil = require('./codex/files.js');
var astUtil = require('./codex/ast.js');

function handlePath(jsPath) {

    if (!fs.existsSync(jsPath)) {
        console.log(jsPath, "does not exist");
        process.exit();
    }

    var stats = fs.lstatSync(jsPath);
    if (stats.isFile()) {
        try {
            var ast = astUtil.parseAST(jsPath);
            astUtil.extractFunctions(ast).map(console.log);
        } catch (err) {
            console.log('could not parse:', jsPath, err);
        }
    }
}


program
    .command('parse <path>')
    .action(handlePath);

program
    .parse(process.argv);

