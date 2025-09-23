import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import express from 'express';
import { PORT } from './config';
import { globalCron } from './crons/global.cron';
import { resolvers, typeDef } from './schema';
import { logger } from './utils/logger';
import db from "./models"
import { Request, Response } from 'express';

class App {
	public app: express.Application;
	public port: string | number;
	private server: any;

	constructor() {
		this.app = express();
		this.port = PORT || 4000;
		this.server = new ApolloServer({ resolvers, typeDefs: typeDef });
		this.createHealthRoute();
		this.initializeCron();
	}

	private initializeCron(): void {
		globalCron();
	}

	private healthCheck = async () => {
		try {
			await db.query('SELECT 1+1 AS result');
			logger.log('info', 'Database is healthy.');
		} catch (error) {
			logger.error('info', 'Database health check failed:', error);
		}
	};

	private createHealthRoute = () => {
		this.app.get('/_health', async (req: Request, res: Response) => {
			await this.healthCheck();
			res.status(200).send('ok');
		});
	};

	private startServer = async () => {
		const { url } = await startStandaloneServer(this.server, {
			listen: { port: Number(this.port) },
		});
		logger.info('==================================================');
		logger.info(`🚀 App listening on port ${this.port}`);
		logger.info(`🚀 Server URl ${url}`);
		logger.info('==================================================');
	};

	public listen = async () => {
		await this.startServer();
	};
}
export default App;
