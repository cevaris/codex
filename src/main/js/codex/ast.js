var acorn = require('acorn-jsx');
var fs = require('fs');
var util = require('util');
var types = require("ast-types");

var logger = require('./logger.js');

function transformAstSourceLocation(loc) {
    var sourceFile = loc.source;
    var startLine = loc.start.line;
    var endLine = loc.end.line;
    return {
        filePath: sourceFile,
        start: startLine,
        end: endLine
    };
}

exports.parseAST = function (jsFile) {
    logger.debug("parseAST ", jsFile);

    var content = fs.readFileSync(jsFile);

    var astValue = acorn.parse(content, {
        locations: true,
        sourceType: "module",
        sourceFile: jsFile,
        plugins: {
            jsx: true
        }
    });

    //console.log(util.inspect(astValue, false, null));
    return astValue ? astValue : [];
};

exports.extractFunctions = function (astValue) {
    var nodes = [];

    logger.info("extracting functions");

    var parseFuncNode = function (path) {
        var node = path.node;

        var funcName = (node.id && node.id.name) ? node.id.name : null;

        nodes.push({
            name: funcName,
            location: transformAstSourceLocation(node.loc)
        });

        this.traverse(path);
    };

    types.visit(astValue, {
        visitFunctionExpression: parseFuncNode,
        visitFunctionDeclaration: parseFuncNode
    });

    return nodes;
};


exports.extractMembers = function (astValue) {
    logger.info("extracting literals");
    var nodeVars = {};
    var objectMemberNodes = [];

    types.visit(astValue, {
        visitImportDeclaration: function (path) {
            var node = path.node;

            if (node.specifiers && node.specifiers.length > 0) {
                var importIdentifier = node.specifiers[0].local.name;
                nodeVars[importIdentifier] = transformAstSourceLocation(node.loc);

                logger.info('import ' + importIdentifier);
            }

            this.traverse(path);
        },
        visitVariableDeclarator: function (path) {
            var node = path.node;

            if ('isGlobal' in path.scope) {
                var sourceLocation = node.loc;
                nodeVars[node.id.name] = transformAstSourceLocation(sourceLocation);
                logger.info(node.type + ' ' + node.id.name);
            }

            this.traverse(path);

        },
        visitMemberExpression: function (path) {
            var node = path.node;

            if (node.object.name && node.property.name) {
                if (node.object.name in nodeVars) {
                    var varDeclLocation = nodeVars[node.object.name];
                    var nodeRefLocation = transformAstSourceLocation(node.object.loc);

                    logger.info(node.object.name);
                    logger.info(varDeclLocation);
                    logger.info(node.type + ' ' + node.object.name + '.' + node.property.name);
                    logger.info(nodeRefLocation);

                    objectMemberNodes.push({
                        object: {
                            name: node.object.name,
                            location: varDeclLocation
                        },
                        member: {
                            name: node.property.name,
                            location: nodeRefLocation
                        }
                    });
                }
            }
            this.traverse(path);
        },
        visitCallExpression: function (path) {
            var node = path.node;

            if (node.callee.name) {
                if (node.callee.name in nodeVars) {
                    var varDeclLocation = nodeVars[node.callee.name];
                    var calleeLocation = transformAstSourceLocation(node.loc);

                    logger.info(node.callee.name);
                    logger.info(varDeclLocation);
                    logger.info(node.type + ' ' + node.callee.name);
                    logger.info(calleeLocation);

                    objectMemberNodes.push({
                        object: {
                            name: node.callee.name,
                            location: varDeclLocation
                        },
                        member: {
                            name: null,
                            location: calleeLocation
                        }
                    });
                }
            }
            this.traverse(path);
        }
    });

    return objectMemberNodes;
};