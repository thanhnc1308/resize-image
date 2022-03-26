const Image = require('./Image');
const CONST = require('./constants');

function generateMockImage() {
    const COUNT = 5;
    const images = [];
    for (let i = 0; i < COUNT; i++) {
        const image = {
            name: `image_${i}.png`,
            url: `${CONST.OLD_S3_HOST}/image_${i}.png`,
        };
        images.push(image);
    }
    return images;
}

module.exports.generateMockImageData = function () {
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
