import {
    PutObjectCommand,
    CreateBucketCommand,
    GetObjectCommand,
} from '@aws-sdk/client-s3';
import { s3Client } from './AWSS3Client.js';

export const createBucket = async (bucketName) => {
    // Create an Amazon S3 bucket.
    try {
        const data = await s3Client.send(
            new CreateBucketCommand({ Bucket: bucketName })
        );
        console.log(data);
        console.log('Successfully created a bucket called ', data.Location);
        return data; // For unit tests.
    } catch (err) {
        console.log('Error', err);
        return null;
    }
};

/**
 * Parameters sample
{
    Bucket: 'BUCKET_NAME', // The name of the bucket. For example, 'sample_bucket_101'.
    Key: 'KEY', // The name of the object. For example, 'sample_upload.txt'.
    Body: 'BODY', // The content of the object. For example, 'Hello world!".
};
 */
export const createObject = async (params) => {
    // Create an object and upload it to the Amazon S3 bucket.
    try {
        const results = await s3Client.send(new PutObjectCommand(params));
        // console.log(
        //     'Successfully created ' +
        //         params.Key +
        //         ' and uploaded it to ' +
        //         params.Bucket +
        //         '/' +
        //         params.Key
        // );
        return results; // For unit tests.
    } catch (err) {
        console.log('Error', err);
        return null;
    }
};

/**
 * @parameters
{
    Bucket: 'BUCKET_NAME', // The name of the bucket. For example, 'sample_bucket_101'.
    Key: 'KEY', // The name of the object. For example, 'sample_upload.txt'.
};
 * @returns Buffer
 */
export const getObject = async (params) => {
    // Create an object and upload it to the Amazon S3 bucket.
    try {
        // Create a helper function to convert a ReadableStream to a Buffer.
        const streamToBuffer = (stream) =>
            new Promise((resolve, reject) => {
                const chunks = [];
                stream.on('data', (chunk) => chunks.push(chunk));
                stream.on('error', reject);
                stream.on('end', () => resolve(Buffer.concat(chunks)));
            });
        const result = await s3Client.send(new GetObjectCommand(params));
        // return result.Body;
        return await streamToBuffer(result.Body);
    } catch (err) {
        console.log('Error', err);
        return null;
    }
};
