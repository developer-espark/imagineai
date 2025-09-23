import {
	BUCKET_NAME,
	CLOUDFRONT_KEY_PAIR_ID,
	CLOUDFRONT_PRIVATE_KEY,
	CLOUDFRONT_URL,
	NODE_ENV,
	SERVER_URL,
} from '@/config';
import { s3 } from '@/config/multerConfig';
import { DeleteObjectCommand, GetObjectCommand, HeadObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import * as cloudfrontSign from 'aws-cloudfront-sign';

import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import fs from 'fs';
import path from 'path';
import { logger } from './logger';

export const createFolders = (dirPath: string) => {
	const resolvedPath = path.resolve(process.cwd(), dirPath);
	if (!fs.existsSync(resolvedPath)) {
		fs.mkdirSync(resolvedPath, { recursive: true });
	}
};

export const deleteFile = async (fileKey: string) => {
	if (NODE_ENV === 'local') {
		// delete file from local
		const resolvedPath = path.resolve(process.cwd(), fileKey);
		fs.unlink(resolvedPath, (err) => {
			if (err) {
				logger.error('Error deleting file:' + err?.message);
			} else {
				logger.info(`File deleted successfully`);
			}
		});
	} else {
		// delete file from s3
		const command = new DeleteObjectCommand({
			Bucket: BUCKET_NAME,
			Key: fileKey,
		});
		try {
			await s3.send(command);
			logger.info(`Deleted ${fileKey} from S3.`);
		} catch (error) {
			logger.error(`Error deleting file ${fileKey}:`, error);
			throw error;
		}
	}
};

export const getFileUrl = async (key: string, expiresIn: number = 3600, download: boolean = false): Promise<string> => {
	try {
		if (NODE_ENV === 'local') {
			const url = `${SERVER_URL}${key}`;
			return url;
		}
		const baseUrl = `${CLOUDFRONT_URL}/${key}`;
		const expireTime = Date.now() + expiresIn * 1000;
		if (download) {
			const command = new GetObjectCommand({
				Bucket: BUCKET_NAME,
				Key: key,
				...(download && {
					ResponseContentDisposition: `attachment; filename="${key.split('/').pop()}"`,
				}),
			});
			const url = await getSignedUrl(s3, command, { expiresIn });
			return url;
		}
		const signedUrl = cloudfrontSign.getSignedUrl(baseUrl, {
			keypairId: CLOUDFRONT_KEY_PAIR_ID,
			privateKeyString: CLOUDFRONT_PRIVATE_KEY,
			expireTime,
		});
		return signedUrl;
	} catch (error) {
		console.error(`Error generating S3 signed URL for key: ${key}`, error);
		throw error;
	}
};

export const uploadFile = async (buffer: Buffer, key: string, type: string) => {
	try {
		const command = new PutObjectCommand({
			Bucket: BUCKET_NAME,
			Key: key,
			Body: buffer,
			ContentType: type,
		});

		await s3.send(command);
		logger.info(`🚀 S3 Bucket file uploaded : ${key}`);
		return true;
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
	} catch (error) {
		return false;
	}
};

export const sanitizeKeyFromSignedUrl = (url: string) => {
	try {
		const parsed = new URL(url);
		return decodeURIComponent(parsed.pathname.startsWith('/') ? parsed.pathname.slice(1) : parsed.pathname);
	} catch {
		return url;
	}
};

export async function s3KeyExists(key: string): Promise<boolean> {
	try {
		await s3.send(
			new HeadObjectCommand({
				Bucket: BUCKET_NAME,
				Key: key,
			}),
		);
		return true;
	} catch (err) {
		if (err.name === 'NotFound') return false;
		throw err;
	}
}
