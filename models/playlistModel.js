const mongoose = require('mongoose');
const shortid = require('shortid');
const MyError = require('../utilities/myError');

const playlistSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: shortid.generate
    },
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

playlistSchema.post('save', function(err, doc, next){
    if(err.name === 'MongoServerError' && err.code === 11000)
        next(new MyError('یک پلی‌لیست با این نام قبلا ایجاد شده است. لطفا نام دیگری انتخاب کنید.', 400));
    else next(new MyError(err, 500));
});

const Playlist = mongoose.model('Playlist', playlistSchema);

module.exports = Playlist;