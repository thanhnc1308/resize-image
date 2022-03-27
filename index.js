import mongoose from 'mongoose';
import Image from './Image.js';
// import mock from './mock.js';
import {
    MONGODB_CONNECTION_STRING,
    OLD_S3_HOST,
    NEW_S3_HOST,
    OLD_BUCKET,
    NEW_BUCKET,
    TEMP_FOLDER,
} from './config.js';
import { createObject, getObject } from './AWSS3Provider.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Get the upload param for PutObjectCommand
 */
function getUploadParams(fileName) {
    const filePath = path.join(fileName);
    const fileStream = fs.createReadStream(filePath);
    return {
        Bucket: NEW_BUCKET,
        Key: path.basename(file),
        Body: fileStream,
    };
}

function createTempFolder() {
    const dir = path.join(__dirname, TEMP_FOLDER);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
}

function saveFile(readStream, fileName) {
    const filePath = path.join(__dirname, TEMP_FOLDER, fileName);
    const writeStream = fs.createWriteStream(filePath);
    readStream.pipe(writeStream);
}

async function main() {
    const imageStream = await getObject({
        Bucket: OLD_BUCKET,
        Key: 'Screenshot-from-2022-03-26-23-21-55.png',
    });
    saveFile(imageStream, 'test1.png')
    // const image = await getObject({
    //     Bucket: OLD_BUCKET,
    //     Key: 'Screenshot-from-2022-03-26-23-21-55.png',
    // });
    // createTempFolder();
    // await connect();
    // mock.generateMockImageData();
    // const listImages = await getListImages();
    // for (const image of listImages) {
    //     await processImage(image);
    // }
}

async function connect() {
    await mongoose.connect(MONGODB_CONNECTION_STRING);
}

async function getListImages() {
    return await Image.find({
        isResized: {
            $in: [void 0, false],
        },
    });
}

async function processImage(image) {
    await updateNewUrl(image);
}

async function getImageFromS3(image) {}

async function resizeImage(imageFile) {}

async function uploadImageToS3(image) {}

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
