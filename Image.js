import mongoose from 'mongoose';

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
        default: false,
    },
});

export default mongoose.model('Image', imageSchema);
