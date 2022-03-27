import { S3Client } from '@aws-sdk/client-s3';
import { AWS_REGION } from './config.js';

const config = {
    region: AWS_REGION
}
// Create an Amazon S3 service client object.
const s3Client = new S3Client(config);
export { s3Client };
