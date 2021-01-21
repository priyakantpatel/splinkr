var path = require('path');
var fs = require('fs');
var winston = require('winston');

var logFilePath = path.resolve(global.splinkr.appPath, 'logs');
var logFileName = path.resolve(logFilePath, 'splinkr.log');
console.log('[logFileName] ' + logFileName);

if (!fs.existsSync(logFilePath)) {
    fs.mkdirSync(logFilePath);
}
//{ silly: 0, debug: 1, verbose: 2, info: 3, warn: 4, error: 5 }

//winston.addColors({
//    silly: 'rainbow',
//    input: 'grey',
//    verbose: 'cyan',
//    prompt: 'grey',
//    info: 'green',
//    data: 'grey',
//    help: 'cyan',
//    warn: 'yellow',
//    debug: 'white',
//    error: 'red'
//});

winston.addColors({
    silly: 'magenta',
    input: 'grey',
    verbose: 'cyan',
    prompt: 'grey',
    info: 'green',
    data: 'grey',
    help: 'cyan',
    warn: 'yellow',
    debug: 'grey',
    error: 'red'
});

var winston = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({
            timestamp: true,
            level: 'silly',
            colorize: true
        }),
        new (winston.transports.File)({
            filename: logFileName,
            level: 'silly',
            maxsize: 1024 * 100,
            maxFiles: 10,
            json : false
        })
    ],
    exitOnError: false
});


//winston.addColors(myCustomLevels.colors);
//{ silly: 0, debug: 1, verbose: 2, info: 3, warn: 4, error: 5 }

//var colors = require('colors');

//colors.setTheme({
//    silly: 'rainbow',
//    input: 'grey',
//    verbose: 'cyan',
//    prompt: 'grey',
//    info: 'green',
//    data: 'grey',
//    help: 'cyan',
//    warn: 'yellow',
//    debug: 'blue',
//    error: 'red'
//});

winston.info('***** Logger starting *****');

module.exports = winston;

//console.log('winston.config.syslog.levels');
//console.log(winston.levels);
