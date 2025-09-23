export interface WeatherStatsAttributes {
	id?: string;
	external_id: string;
	place: string;
	mag?: number;
	time: Date | string;
	updated: Date | string;
	tz?: number;
	url: string;
	detail?: string;
	felt?: number;
	cdi?: number;
	mmi?: number;
	alert?: string;
	status?: string;
	tsunami: number;
	sig?: number;
	net?: string;
	code?: string;
	sources?: string;
	types?: string;
	nst?: number;
	dmin?: number;
	rms?: number;
	gap?: number;
	magType?: string;
	type?: string;
	title: string;
	geometry_type: string;
	geometry_coordinates: number[]; // JSONB
	created_at?: Date | string;
	updated_at?: Date | string;
	deleted_at?: Date | string;
}
