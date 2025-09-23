import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import express from 'express';
import { PORT } from './config';
import { globalCron } from './crons/global.cron';
import { resolvers, typeDef } from './schema';
import { logger } from './utils/logger';

class App {
	public app: express.Application;
	public port: string | number;
	private server: any;

	constructor() {
		this.app = express();
		this.port = PORT || 4000;
		this.server = new ApolloServer({ resolvers, typeDefs: typeDef });
		this.initializeCron();
	}

	private initializeCron(): void {
		globalCron();
	}

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
