const mongoose = require('mongoose');
const Image = require('./Image');
// const mock = require('./mock');
const CONST = require('./constants');

async function main() {
    await connect();
    // mock.generateMockImageData();
    const listImages = await getListImages();
    for (const image of listImages) {
        await processImage(image);
    }
}

async function connect() {
    await mongoose.connect(CONST.MONGODB_CONNECTION_STRING);
}

async function getListImages() {
    return await Image.find({
        isResized: {
            $in: [
                void 0,
                false
            ]
        }
    })
}

async function processImage(image) {
    await updateNewUrl(image);
}

async function getImageFromS3(image) {

}

async function resizeImage(imageFile) {

}

async function uploadImageToS3(image) {

}

async function updateNewUrl(image) {
    const { id, url } = image;
    const newUrl = url.replace(CONST.OLD_S3_HOST, CONST.NEW_S3_HOST);
    await Image.findByIdAndUpdate(id, {
        url: newUrl
    })
}

try {
    main();
} catch (e) {
    console.error(e);
}
