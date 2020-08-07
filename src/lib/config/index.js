const {
  APP_NAME,
  NODE_ENV,
  JWT_ALGORITHM,
  JWT_EXP,
  JWT_SECRET,
  L_AWS_ACCESS_KEY,
  L_AWS_SECRET,
  L_AWS_REGION,
  L_AWS_BUCKET_NAME,
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
  REDIS_ENDPOINT,
  REDIS_PASSWORD,
  REDIS_PORT,
  PUSHER_APP_ID,
  PUSHER_KEY,
  PUSHER_SECRET,
  PUSHER_CLUSTER,
} = process.env;

let credentials = '';

/**
 * Mongodb connection with credentials
 */
if(DB_HOST && DB_PORT && DB_PASSWORD) {
  credentials = `${DB_HOST}:${DB_PORT}:${encodeURIComponent(DB_PASSWORD)}@`;
}

/**
 * Basic configuration. This can be used to put default values incase if the .env variables fail
 * Can be used in API projects without modification
 * Alter the Cloud settings, Database settings whenever necessary.
 * @type {{app: {ENV: string | string, NAME: string | string}, mongo: {host: (string|string), url: string}, jwt: {secret: string, exp: string, algorithm: string | string}, aws: {AWS_REGION: string, AWS_SECRET: string, AWS_BUCKET_NAME: string, AWS_ACCESS_KEY: string}, pusher_keys: {cluster: string, secret: string, app_id: string, key: string}, redis: {PASSWORD: string | string, PORT: string | number, ENDPOINT: string | string}, hash: {saltRounds: number}}}
 */
const baseSettings  = {
  app:{
    NAME: APP_NAME || 'real-analytics',
    ENV: NODE_ENV || 'development'
  },
  aws: {
    AWS_SECRET: L_AWS_SECRET,
    AWS_ACCESS_KEY: L_AWS_ACCESS_KEY,
    AWS_REGION: L_AWS_REGION,
    AWS_BUCKET_NAME: L_AWS_BUCKET_NAME,
  },
  mongo: {
      url: `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${NODE_ENV}-${DB_NAME}` || `mongodb://localhost/${NODE_ENV}-${APP_NAME}`,
      host: `${DB_HOST}` || 'mongodb://localhost/user-service'
  },
  redis: {
    PASSWORD: REDIS_PASSWORD || '',
    ENDPOINT: REDIS_ENDPOINT || '127.0.0.1',
    PORT: REDIS_PORT || 6379
  },
  pusher_keys: {
    app_id: PUSHER_APP_ID,
    key: PUSHER_KEY,
    secret: PUSHER_SECRET,
    cluster: PUSHER_CLUSTER,
  },
  jwt: {
    algorithm: JWT_ALGORITHM || 'HS256',
    secret: JWT_SECRET,
    exp: JWT_EXP
  },
  hash: {
    saltRounds: 3,
  }
};

module.exports = Object.freeze(baseSettings);



