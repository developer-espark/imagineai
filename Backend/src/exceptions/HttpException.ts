export class HttpException<T = Record<string, unknown>> extends Error {
	public status: number;
	public message: string;
	public toast: boolean;
	public data?: T;

	constructor(status: number, message: string, data?: T, toast = false) {
		super(message);
		this.name = 'HttpException';
		this.status = status || 400;
		this.message = message;
		this.toast = toast;
		this.data = data;
	}
}
