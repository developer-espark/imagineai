import { Request, Response } from 'express';
import _ from 'lodash';

const formatErrorResponse = (input) => {
	const words = input.split(',');
	const formattedWords = words.map((word) => word.trim());
	return formattedWords.join(',');
};

const generalResponse = (
	_req: Request,
	response: Response,
	data: unknown = [],
	message = '',
	response_type = 'success',
	toast = false,
	statusCode = 200,
) => {
	if (statusCode !== 200) {
		return response.status(statusCode).send({
			responseData: data,
			message: message ? formatErrorResponse(message) : '',
			toast: toast,
			response_type: response_type,
		});
	}
	return response.status(statusCode).send({
		responseData: data,
		message: message ? _.startCase(message) : '',
		toast: toast,
		response_type: response_type,
	});
};

export default generalResponse;
