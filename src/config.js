
let CONFIG;
const defaultPort = 4008;
const defaultConsoleLogLevel = 'silly';
const defaultLogLevel = 'silly';

export function setConfig() {
  CONFIG = parseConfig();
}

function getBooleanValue(value) {
  if (
    value === true ||
    value === 1 ||
    value === 'true' ||
    value === '1' ||
    value === 'yes' ||
    value === 'y'
  ) {
    return true;
  } else if (
    value === false ||
    value === 0 ||
    value === 'false' ||
    value === '0' ||
    value === 'no' ||
    value === 'n'
  ) {
    return false;
  }
  return true;
}

function getGeneralEnvs() {
  const env = process.env;
  return {
    port: env.PORT ? parseInt(env.PORT) : defaultPort,
    credStatusService: env.CRED_STATUS_SERVICE,
    credStatusDidSeed: env.CRED_STATUS_DID_SEED,
    consoleLogLevel: env.CONSOLE_LOG_LEVEL?.toLocaleLowerCase() || defaultConsoleLogLevel,
    logLevel: env.LOG_LEVEL?.toLocaleLowerCase() || defaultLogLevel,
    enableAccessLogging: getBooleanValue(env.ENABLE_ACCESS_LOGGING),
    errorLogFile: env.ERROR_LOG_FILE,
    allLogFile: env.ALL_LOG_FILE
  };
}

function getMongoDbEnvs() {
  const env = process.env;
  return {
    statusCredSiteOrigin: env.STATUS_CRED_SITE_ORIGIN,
    credStatusDatabaseUrl: env.CRED_STATUS_DB_URL,
    credStatusDatabaseHost: env.CRED_STATUS_DB_HOST,
    credStatusDatabasePort: env.CRED_STATUS_DB_PORT,
    credStatusDatabaseUsername: env.CRED_STATUS_DB_USER,
    credStatusDatabasePassword: env.CRED_STATUS_DB_PASS,
    credStatusDatabaseName: env.CRED_STATUS_DB_NAME,
    statusCredTableName: env.STATUS_CRED_TABLE_NAME,
    configTableName: env.CONFIG_TABLE_NAME,
    eventTableName: env.EVENT_TABLE_NAME,
    credEventTableName: env.CRED_EVENT_TABLE_NAME
  };
}

function parseConfig() {
  const env = process.env
  let serviceSpecificEnvs;
  switch (env.CRED_STATUS_SERVICE) {
    case 'mongodb':
      serviceSpecificEnvs = getMongoDbEnvs();
      break;
    default:
      throw new Error('Encountered unsupported credential status service');
  }
  const generalEnvs = getGeneralEnvs();
  const config = Object.freeze({
    ...generalEnvs,
    ...serviceSpecificEnvs
  });
  return config;
}

export function getConfig() {
  if (!CONFIG) {
    setConfig();
  }
  return CONFIG;
}

export function resetConfig() {
  CONFIG = null;
}
