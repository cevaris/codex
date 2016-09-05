#!/usr/bin/env node


var program = require('commander');
var fs = require('fs');
var util = require('util');

var ast = require('./codex/ast.js');
var logger = require('./codex/logger.js');

function parseFuncs(astValue) {
    logger.debug('parseFuncs');

    try {
        if (astValue) {
            return ast.extractFunctions(astValue);
        } else {
            logger.info('empty ast value');
        }
    } catch (err) {
        logger.error('walking ast: ' + err);
    }

    return [];
}

function parseMembers(astValue) {
    logger.debug('parseMembers');

    try {
        if (astValue) {
            return ast.extractMembers(astValue);
        } else {
            logger.info('empty ast value');
        }
    } catch (err) {
        logger.error('walking ast: ' + err);
    }

    return null;
}

function parsePath(jsPath, options) {
    logger.debug('parsePath ' + jsPath + ' ' + options);

    if (!fs.existsSync(jsPath)) {
        logger.error('file ' + jsPath + " does not exist");
        return;
    }

    var stats = fs.lstatSync(jsPath);
    if (!stats.isFile()) {
        logger.error(jsPath + " is not a file");
        return;
    }

    var astValue = null;
    try {
        astValue = ast.parseAST(jsPath);
    } catch (err) {
        logger.error('could not parse: ' + jsPath + ' ' + err);
        return;
    }

    var funcs = [];
    var members = [];

    if (options.funcs) {
        funcs = parseFuncs(astValue);
    } else if (options.members) {
        members = parseMembers(astValue);
    } else {
        funcs = parseFuncs(astValue);
        members = parseMembers(astValue);
    }

    var result = {
        filePath: jsPath,
        members: members,
        funcs: funcs
    };


    //console.log(util.inspect(result, false, null));
    console.log(JSON.stringify(result));
}


program
    .command('parse  <path>')
    .option('-f, --funcs', 'parse functions')
    .option('-l, --members', 'parse members')
    .option('-a, --all', 'parse all elements')
    .action(parsePath);

program
    .parse(process.argv);

