const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    title: { type: String, required: true, maxLength: 100 },
    text: { type: String, required: true },
    published: { type: Boolean, required: true },
});

module.exports = mongoose.model('Post', PostSchema);
