import mongoose from 'mongoose';
import Image from './Image.js';
// import mock from './mock.js';
import {
    MONGODB_CONNECTION_STRING,
    OLD_S3_HOST,
    NEW_S3_HOST,
    OLD_BUCKET,
    NEW_BUCKET,
} from './config.js';
import { createObject, getObject } from './AWSS3Provider.js';
import sharp from 'sharp';

async function main() {
    await connect();
    // mock.generateMockImageData();
    const listImages = await getListImages();
    console.log(listImages.length);
    for (const image of listImages) {
        await processImage(image);
    }
}

async function connect() {
    await mongoose.connect(MONGODB_CONNECTION_STRING);
}

async function getListImages() {
    return await Image.find({
        url: new RegExp(OLD_S3_HOST, 'i'),
    });
    // return await Image.find({
    //     isResized: {
    //         $in: [void 0, false],
    //     },
    // });
}

async function processImage(image) {
    try {
        const imageName = image.name;
        const rawImageBuffer = await getImageFromS3(imageName);
        const options = {
            width: 80,
            height: 100,
        };
        const resizeImageBuffer = await resizeImage(rawImageBuffer, options);
        const result = await uploadImageToS3(imageName, resizeImageBuffer);
        if (result) {
            await updateNewUrl(image);
        }
    } catch (e) {
        console.log(e);
    }
}

/**
 * Get Buffer Image from S3
 * @param {*} imageName file name of image in S3
 * @returns Buffer
 */
async function getImageFromS3(imageName) {
    return await getObject({
        Bucket: OLD_BUCKET,
        Key: imageName,
    });
}

/**
 * Resize image
 * @param {*} imageBuffer
 * @param {*} options { width: <width>, height: <height>
 * @returns BufferImage
 */
async function resizeImage(imageBuffer, options) {
    try {
        return await sharp(imageBuffer).resize(options).toBuffer();
    } catch {
        return null;
    }
}

/**
 * Upload
 * @param {*} imageName
 * @param {*} resizeImageBuffer
 * @returns result if successful or null if failure
 */
async function uploadImageToS3(imageName, resizeImageBuffer) {
    const file = getUploadParamsFromBuffer(imageName, resizeImageBuffer);
    return await createObject(file);
}

/**
 * Get the upload param for PutObjectCommand
 */
function getUploadParamsFromBuffer(fileName, buffer) {
    return {
        Bucket: NEW_BUCKET,
        Key: fileName,
        Body: buffer,
    };
}

async function updateNewUrl(image) {
    const { id, url } = image;
    const newUrl = url.replace(OLD_S3_HOST, NEW_S3_HOST);
    await Image.findByIdAndUpdate(id, {
        url: newUrl,
    });
}

try {
    main();
} catch (e) {
    console.error(e);
}
