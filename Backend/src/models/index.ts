import fs from 'fs';
import path from 'path';
import { ModelCtor, Sequelize } from 'sequelize-typescript';
import { DATABASE_URL, NODE_ENV } from '../config';

let db: Sequelize;

const initSequelize = () => {
	const _basename = path.basename(module.filename);
	const sequelize = new Sequelize(DATABASE_URL, {
		dialect: 'postgres',
		logging: (NODE_ENV === 'development' || NODE_ENV === 'local') && console.log,
		pool: {
			max: 20,
			min: 2,
			idle: 10000,
			acquire: 30000,
		},
		retry: {
			max: 3,
			match: [/ETIMEDOUT/, /ECONNREFUSED/],
		},
	});

	const _models = fs
		.readdirSync(__dirname)
		.filter((file: string) => {
			return (
				file !== _basename &&
				file !== 'interfaces' &&
				!file.endsWith('.d.ts') &&
				(file.slice(-3) === '.js' || file.slice(-3) === '.ts')
			);
		})
		.map((file: string) => {
			const model: ModelCtor = require(path.join(__dirname, file))?.default;
			return model;
		});

	sequelize.addModels(_models);
	return sequelize;
};

if (!db) {
	db = initSequelize();
}

export default db;
