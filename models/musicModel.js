const mongoose = require('mongoose');
const fuzzy = require('mongoose-fuzzy-searching');

const musicSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'The music must have a title.']
    },
    album: String,
    artist: [String],
    releaseDate: Date,
    genre: String,
    category: {
        type: [String],
        required: [true, 'Each music must have at least one category.']
    },
    musicPath: {
        type: String,
        required: [true, 'Where is located the music!']
    },
    coverImagePath: String,
    description: String
});

musicSchema.plugin(fuzzy, {
    fields: ['title']
})

const Music = mongoose.model('Music', musicSchema);

module.exports = Music;