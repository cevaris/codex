var acorn = require('acorn-jsx');
var estraverse = require('estraverse');
var fs = require('fs');
var util = require('util');

var filesUtil = require('./files.js');

/**
 *
 * /git/redux/examples/async/components/Picker.js
 * /git/redux/examples/async/actions/index.js
 */

exports.parseAST = function (jsFile) {

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

    //console.log(ast);
    //console.log(util.inspect(ast, false, null));
    return ast;
};

exports.extractFunctions = function (ast) {
    console.log("searching for functions");
    var functions = []

    estraverse.traverse(ast, {
        enter: function (node, parent) {
            if (node.type == 'FunctionExpression' || node.type == 'FunctionDeclaration') {
                var sourceLocation = node.loc;
                var sourceFile = sourceLocation.source;
                var startLine = sourceLocation.start.line;
                var endLine = sourceLocation.end.line;

                var pad = 2;
                var func = filesUtil.fileLinesAtRange(
                    sourceFile, startLine - pad, endLine + pad
                );
                functions.push(func);
            }
        },
        fallback: 'iteration'
    });

    return functions;
};