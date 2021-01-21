var logger = require('./srv/utils/Logger')

//var logger = new (winston.Logger)({
//    transports: [
//        new (winston.transports.Console)(),
//        new (winston.transports.File)({ filename: './logs/testLog.log' })
//    ]
//});

//winston.add(winston.transports.File, { filename: './logs/test.log' });
//winston.remove(winston.transports.Console);
//winston.exitOnError = false;

logger.log('logger.exitOnError');
logger.log(logger.exitOnError || 'NONE');

logger.log('info', 'Hello distributed log files!');
logger.info('Hello again distributed logs');

logger.log('debug', 'Now my debug messages are written to console!');

logger.error('Test message');
logger.warn('Test message');
logger.info('Test message');
logger.verbose('Test message');
logger.debug('Test message');
logger.silly('Test message');

for (var i = 0; i < 1000; i++) {
    logger.error('Test message' + (new Date()));
    logger.warn('Test message');
    logger.info('Test message');
    logger.verbose('Test message');
    logger.debug('Test message');
    logger.silly('Test message');
}