import mongoose from 'mongoose';
import Image from './Image.js';
// import mock from './mock.js';
import {
    MONGODB_CONNECTION_STRING,
    OLD_S3_HOST,
    NEW_S3_HOST,
} from './constants.js';

async function main() {
    await connect();
    // mock.generateMockImageData();
    const listImages = await getListImages();
    for (const image of listImages) {
        await processImage(image);
    }
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
