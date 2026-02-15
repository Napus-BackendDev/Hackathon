const morgan = require('morgan');

// Custom token for response time with color
morgan.token('response-time-colored', (req, res) => {
    const responseTime = parseFloat(morgan['response-time'](req, res));
    const color = responseTime > 500 ? '\x1b[31m' : responseTime > 200 ? '\x1b[33m' : '\x1b[32m';
    const reset = '\x1b[0m';
    return `${color}${responseTime.toFixed(2)}ms${reset}`;
});

// Custom format
const customFormat = ':method :url :status :response-time-colored - :res[content-length]';

// Create logger middleware
const logger = morgan(customFormat);

module.exports = logger;
