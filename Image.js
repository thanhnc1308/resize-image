const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
    isResized: {
        type: Boolean,
        default: false
    },
});

module.exports = mongoose.model('Image', imageSchema);
