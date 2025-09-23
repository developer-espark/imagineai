const dotEnv = require('dotenv');

dotEnv.config({ path: `.env` });

module.exports = {
	url: process.env.DATABASE_URL,
	dialect: 'postgres',
};
