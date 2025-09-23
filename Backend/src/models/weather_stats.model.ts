import { WeatherStatsAttributes } from '@/interfaces/weather_stats.interface';
import { Column, CreatedAt, DataType, Default, Model, Table, UpdatedAt } from 'sequelize-typescript';

@Table({
	timestamps: true,
	tableName: 'weather_stats',
})

export default class WeatherStats extends Model<WeatherStatsAttributes> implements WeatherStatsAttributes {
	@Default(DataType.UUIDV4)
	@Column({
		primaryKey: true,
		allowNull: false,
		type: DataType.UUID,
	})
	id: string;

	@Column({
		type: DataType.STRING,
		allowNull: false,
	})
	external_id: string;

	@Column({
		type: DataType.STRING,
		allowNull: false,
	})
	place: string;

	@Column({
		type: DataType.FLOAT,
		allowNull: true,
		defaultValue: 0,
	})
	mag: number;

	@Column({
		allowNull: false,
		type: DataType.DATE,
	})
	time: Date;

	@Column({
		allowNull: false,
		type: DataType.DATE,
	})
	updated: Date;

	@Column({
		allowNull: true,
		type: DataType.INTEGER,
		defaultValue: 0,
	})
	tz: number;

	@Column({
		allowNull: false,
		type: DataType.STRING,
	})
	url: string;

	@Column({
		allowNull: true,
		type: DataType.STRING,
	})
	detail: string;

	@Column({
		allowNull: true,
		type: DataType.INTEGER,
		defaultValue: 0,
	})
	felt: number;

	@Column({
		allowNull: true,
		type: DataType.FLOAT,
		defaultValue: 0,
	})
	cdi: number;

	@Column({
		allowNull: true,
		type: DataType.FLOAT,
		defaultValue: 0,
	})
	mmi: number;

	@Column({
		allowNull: true,
		type: DataType.STRING,
	})
	alert: string;

	@Column({
		allowNull: true,
		type: DataType.STRING,
	})
	status: string;

	@Column({
		allowNull: false,
		type: DataType.INTEGER,
		defaultValue: 0,
	})
	tsunami: number;

	@Column({
		allowNull: true,
		type: DataType.INTEGER,
		defaultValue: 0,
	})
	sig: number;

	@Column({
		allowNull: true,
		type: DataType.STRING,
	})
	net: string;

	@Column({
		allowNull: true,
		type: DataType.STRING,
	})
	code: string;

	@Column({
		allowNull: true,
		type: DataType.TEXT,
	})
	sources: string;

	@Column({
		allowNull: true,
		type: DataType.TEXT,
	})
	types: string;

	@Column({
		allowNull: true,
		type: DataType.INTEGER,
		defaultValue: 0,
	})
	nst: number;

	@Column({
		allowNull: true,
		type: DataType.FLOAT,
		defaultValue: 0,
	})
	dmin: number;

	@Column({
		allowNull: true,
		type: DataType.FLOAT,
		defaultValue: 0,
	})
	rms: number;

	@Column({
		allowNull: true,
		type: DataType.FLOAT,
		defaultValue: 0,
	})
	gap: number;

	@Column({
		allowNull: true,
		type: DataType.STRING,
	})
	magType: string;

	@Column({
		allowNull: true,
		type: DataType.STRING,
	})
	type: string;

	@Column({
		allowNull: false,
		type: DataType.STRING,
	})
	title: string;

	@Column({
		allowNull: false,
		type: DataType.STRING,
	})
	geometry_type: string;

	@Column({
		allowNull: false,
		type: DataType.JSONB,
	})
	geometry_coordinates: number[];

	@CreatedAt
	created_at: Date;

	@UpdatedAt
	updated_at: Date;
}
