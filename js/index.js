#!/usr/bin/env node


var program = require('commander');
var fs = require('fs');

var astUtil = require('./codex/ast.js');
var logger = require('./codex/logger.js').logger;

function doit(jsPath) {
    var ast = undefined;
    try {
        ast = astUtil.parseAST(jsPath);
    } catch (err) {
        logger.error('could not parse: ' + jsPath + ' ' + err);
    }

    var jsonData = {};
    try {
        if (ast) {
            jsonData = astUtil.extractFunctions(ast);
        }
    } catch (err) {
        logger.error('walking ast: ' + jsPath + ' ' + err);
    }

    if (jsonData) {
        console.log(jsonData)
    } else {
        logger.info('no functions found');
    }
}

function handlePath(jsPath) {

    if (!fs.existsSync(jsPath)) {
        logger.error(jsPath + " does not exist");
        process.exit();
    }

    var stats = fs.lstatSync(jsPath);
    if (stats.isFile()) {
        doit(jsPath)
    }
}


program
    .command('parse <path>')
    .action(handlePath);

program
    .parse(process.argv);

