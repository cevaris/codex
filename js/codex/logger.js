var log4js = require('log4js');


log4js.configure({
    appenders: [
        {type: 'file', filename: 'logs/codexjs.log'}
    ]
});

var logger = log4js.getLogger();

exports.logger = logger;