import 'dotenv/config.js';
import { bool, cleanEnv, port, str } from 'envalid';

export const validateEnv = cleanEnv(process.env, {
    BASE_URL: str({
        default: 'http://localhost:3000',
    }),
    NODE_ENV: str({
        devDefault: 'development',
        default: 'production',
        choices: ['development', 'production'],
        desc: 'Current Environment',
    }),
    APP_PORT: port(),
    MONGODB_URL: str({
        devDefault: 'mongodb://localhost:27017/college-erp-poc-dev',
        default: 'mongodb://localhost:27017/college-erp-poc-prod',
    }),
    DEBUG_MODE: bool({ default: false }),
});
