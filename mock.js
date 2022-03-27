import Image from './Image.js';
import { OLD_S3_HOST } from './constants.js';

function generateMockImage() {
    const COUNT = 5;
    const images = [];
    for (let i = 0; i < COUNT; i++) {
        const image = {
            name: `image_${i}.png`,
            url: `${OLD_S3_HOST}/image_${i}.png`,
        };
        images.push(image);
    }
    return images;
}

export function generateMockImageData () {
    const images = generateMockImage();
    Image.collection.insertMany(images, function (err, docs) {
        if (err) {
            console.log(err);
        } else {
            console.log('Successful');
        }
        // console.log(docs);
    });
};
