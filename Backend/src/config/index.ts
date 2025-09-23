import { config } from 'dotenv';
config({ path: `.env` });

export const CREDENTIALS = process.env.CREDENTIALS === 'true';
export const { NODE_ENV, PORT, DATABASE_URL, SERVER_URL, LOG_DIR } = process.env;
