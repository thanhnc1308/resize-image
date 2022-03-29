import Image from './Image.js';
import { OLD_S3_HOST } from './config.js';

function generateMockImage() {
    const COUNT = 50;
    const images = [];
    for (let i = 0; i < COUNT; i++) {
        const image = {
            name: `image1.png`,
            url: `${OLD_S3_HOST}/image_${i}.png`,
        };
        images.push(image);
    }
    return images;
}

async function clearData() {
    await Image.collection.deleteMany();
}

export async function generateMockImageData() {
    await clearData();
    const images = generateMockImage();
    await Image.collection.insertMany(images);
}
