import { logger } from '@/utils/logger';
import cron from 'node-cron';

export const globalCron = () => {
	cron.schedule('* * * * * *', async () => {
		console.log('Code for cron');
	});
};