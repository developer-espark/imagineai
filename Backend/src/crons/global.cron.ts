import { WeatherStatsAttributes } from '@/interfaces/weather_stats.interface';
import WeatherStats from '@/models/weather_stats.model';
import { parse } from '@/utils/common.util';
import axios from 'axios';
import cron from 'node-cron';
import { Op } from 'sequelize';

export const globalCron = () => {
	cron.schedule('10 * * * * *', async () => {
		storeWeatherStatsData();
	});
};

const storeWeatherStatsData = async () => {
	const response = await axios.get('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson');

	const data: WeatherStatsAttributes[] = [];

	for (const element of response?.data?.features) {
		const properties = element?.properties;
		data?.push({
			place: properties?.place,
			mag: properties?.mag,
			time: properties?.time,
			updated: properties?.updated,
			tz: properties?.tz,
			url: properties?.url,
			detail: properties?.detail,
			felt: properties?.felt ?? 0,
			cdi: properties?.cdi ?? 0,
			mmi: properties?.mmi ?? 0,
			alert: properties?.alert ?? null,
			status: properties?.status ?? null,
			tsunami: properties?.tsunami ?? 0,
			sig: properties?.sig ?? 0,
			net: properties?.net ?? null,
			code: properties?.code ?? null,
			sources: properties?.sources ?? null,
			types: properties?.types ?? null,
			nst: properties?.nst ?? 0,
			dmin: properties?.dmin ?? 0,
			rms: properties?.rms ?? 0,
			gap: properties?.gap ?? 0,
			magType: properties?.magType ?? null,
			type: properties?.type ?? null,
			title: properties?.title,
			external_id: properties?.ids,
			geometry_type: element?.geometry?.type,
			geometry_coordinates: parse(element?.geometry?.coordinates),
		});
	}

	const ids = data?.map((item) => item?.external_id);

	const getWeatherStatsData = await WeatherStats.findAll({
		where: {
			external_id: {
				[Op.in]: ids,
			},
		},
	});

	const newData = [];

	for (let index = 0; index < data.length; index++) {
		const item = data[index];
		const isExist = getWeatherStatsData.some((weather_stat) => weather_stat.external_id === item.external_id);
		if (isExist) {
			await WeatherStats.update({ ...item }, { where: { external_id: item.external_id } });
		} else {
			newData.push(item);
		}
	}

	const resp = await WeatherStats.bulkCreate(newData);
};
