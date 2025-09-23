import { NextFunction, Request, Response } from 'express';

export const catchAsync = (fn) => (req: Request, res: Response, next: NextFunction) => {
	return Promise.resolve(fn(req, res, next)).catch((err) => {
		console.log(err, 'err');
		next(err);
	});
};
