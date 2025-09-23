import { MessageFormation } from '@/constants/messages.constants';
import { HttpException } from '@/exceptions/HttpException';
import db from '@/models';
import WeatherStats from '@/models/weather_stats.model';
import { parse } from '@/utils/common.util';
import moment from 'moment';
import { Op, Sequelize } from 'sequelize';

export default class WeatherStatsRepo {
	private readonly msg = new MessageFormation('Weather Stats').message;

	async list() {
		const data = await WeatherStats.findAll({
			order: [['updated', 'DESC']],
		});

		return parse(data);
	}

	async getDataForQuakesChart() {
		const data = await WeatherStats.findAll({
			where: {
				updated: {
					[Op.gte]: moment().subtract(1, 'hours').toDate(),
				},
			},
			attributes: [
				[
					Sequelize.literal(`
						to_timestamp(floor(extract(epoch from "updated") / 600) * 600)
					`),
					'interval_bucket',
				],
				[Sequelize.fn('COUNT', Sequelize.col('id')), 'count'],
			],
			group: ['interval_bucket'],
			order: [[Sequelize.literal('interval_bucket'), 'ASC']],
		});

		return data.map((row: any) => {
			return {
				interval: row.get('interval_bucket'),
				count: Number(row.get('count')),
			};
		});
	}

	async getCounts() {
		const result = await WeatherStats.findOne({
			attributes: [
				[Sequelize.cast(Sequelize.fn('COUNT', Sequelize.col('id')), 'integer'), 'total_count'],
				[Sequelize.cast(Sequelize.fn('MAX', Sequelize.col('mag')), 'float'), 'max_mag'],
				[
					Sequelize.literal(`(
							SELECT "place"
							FROM "weather_stats"
							WHERE "mag" = (SELECT MAX("mag") FROM "weather_stats")
							LIMIT 1
						)`),
					'max_mag_place',
				],
			],
			raw: true,
		});

		return result;
	}
}
