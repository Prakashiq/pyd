import path from 'path';
import merge from 'lodash/merge';

// Default configuations applied to all environments
const defaultConfig = {
  env: process.env.NODE_ENV,
  get envs() {
    return {
      test: process.env.NODE_ENV === 'test',
      development: process.env.NODE_ENV === 'development',
      production: process.env.NODE_ENV === 'production',
    };
  },

  version: require('../../package.json').version,
  root: path.normalize(__dirname + '/../../..'),
  port: process.env.PORT || 4567,
  ip: process.env.IP || '0.0.0.0',
  apiPrefix: '', // Could be /api/resource or /api/v2/resource
  userRoles: ['guest', 'user', 'admin'],

  smsconfig: {
    smsFrom: process.env.SMS_FROM || '+16515714917',
    smsTo: process.env.SMS_TO || '+16124122842',
    smsAccountSid : process.env.SMS_ASID || 'AC439c22f643aded864fcb37d5aed0f8b7',
    smsAuthToken : process.env.SMS_AUTHTOKEN ||'ee2726b449a51777ee250d5d79d9bf17' 
  }, 

   errorresponseJson: {
    speech:'OOPS! Something got broken! Please re-enter the userid',
    outputContexts:[{'name': 'start_trip', 'lifespan':0, 'parameters':{}}],
    },
  
  /**
   * Security configuation options regarding sessions, authentication and hashing
   */
  security: {
    sessionSecret: process.env.SESSION_SECRET || 'voiceconsolesecretsessionid',
    sessionExpiration: process.env.SESSION_EXPIRATION || 60 * 60 * 24 * 7, // 1 week
    saltRounds: process.env.SALT_ROUNDS || 12,
  },
};


// Environment specific overrides
const environmentConfigs = {
  development: {
    security: {
      saltRounds: 4,
    },
  },
  test: {
    port: 5678,
    security: {
      saltRounds: 4,
    },
  },
  production: {
  },
};

// Recursively merge configurations
export default merge(defaultConfig, environmentConfigs[process.env.NODE_ENV] || {});
