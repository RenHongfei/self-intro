import chalk from 'chalk';

const getStatusColor = (statusCode) => {
  if (statusCode >= 500) return chalk.red;
  if (statusCode >= 400) return chalk.yellow;
  if (statusCode >= 300) return chalk.cyan;
  return chalk.green;
};

const getMethodColor = (method) => {
  const colors = {
    GET: chalk.green,
    POST: chalk.blue,
    PUT: chalk.yellow,
    DELETE: chalk.red,
    PATCH: chalk.magenta
  };
  return colors[method] || chalk.white;
};

export const requestLogger = (req, res, next) => {
  const start = Date.now();
  const timestamp = new Date().toISOString();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const statusColor = getStatusColor(res.statusCode);
    const methodColor = getMethodColor(req.method);

    const logMessage = [
      chalk.gray(`[${timestamp}]`),
      methodColor(req.method.padEnd(6)),
      chalk.white(req.path),
      statusColor(`${res.statusCode}`),
      chalk.gray(`${duration}ms`)
    ].join(' ');

    console.log(logMessage);

    if (duration > 1000) {
      console.log(chalk.yellow(`⚠️  Slow request: ${req.path} took ${duration}ms`));
    }
  });

  next();
};

export const logInfo = (message, data = {}) => {
  console.log(chalk.blue(`[INFO] ${message}`), data);
};

export const logError = (message, error = {}) => {
  console.error(chalk.red(`[ERROR] ${message}`), error);
};

export const logWarn = (message, data = {}) => {
  console.warn(chalk.yellow(`[WARN] ${message}`), data);
};
