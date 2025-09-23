import { MessageFormation } from '@/constants/messages.constants';
import { HttpException } from '@/exceptions/HttpException';
import db from '@/models';
import WeatherStats from '@/models/weather_stats.model';
import { parse } from '@/utils/common.util';

export default class WeatherStatsRepo {
	private readonly msg = new MessageFormation('Weather Stats').message;

	async list() {
		const data = await WeatherStats.findAll({
			order:[['updated','DESC']]
		});
		
		return parse(data);
	}
}
