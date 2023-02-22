const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'لطفا یک عنوان برای پلی‌لیست خود انتخاب کنید.']
    },
    owner: {
        type: String,
        required: [true, 'هر پلی‌لیست باید به یک کاربر خاص تعلق داشته باشد.']
    },
    musics: [String]
});

playlistSchema.index({
    title: 1,
    owner: 1
}, {unique: true});

const Playlist = mongoose.model('Playlist', playlistSchema);

module.exports = Playlist;