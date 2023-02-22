const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
const userRouter = require('./routes/userRoute');
const musicRouter = require('./routes/musicRoute');
const playlistRouter = require('./routes/playlistRoute');
const MyError = require('./utilities/myError');

const host = '0.0.0.0';
const port = 3000;

const app = express();

var cors = require('cors')

app.use(cors())

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));
app.use(fileUpload({
    createParentPath: true,
    limits: {fileSize: 20 * 1024 * 1024},
    limitHandler: (req, res, next) => {
        next(new MyError('فایلی که آپلود کرده‌اید بیشتر از 20 مگابایت می‌باشد.', 400));
    }
}))

app.get('/api', (req, res, next) => {
    res.status(200).json({
        message: 'homepage22'
    });
});

app.use('/api/users', userRouter);
app.use('/api/musics', musicRouter);
app.use('/api/playlists', playlistRouter);

app.all('*', (req, res, next) => {
    next(new MyError('404 not found', 404));
});

app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    res.status(err.statusCode).json({
        error: err,
        message: err.message
    });
});

mongoose.connect('mongodb://root:rCdXKhAFuY7GKaosGNhLesQu@alfie.iran.liara.ir:31037/my-app?authSource=admin', {
    useNewUrlParser: true
  }).then(() => {
    console.log('connected to DB successfully...');
}).catch((err) => {
    console.log(err);
})

app.listen(port, host, () => {
    console.log('server is running...');
});
