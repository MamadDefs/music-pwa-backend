const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('../models/userModel');
const Music = require('../models/musicModel');
const MyError = require('../utilities/myError');

const secret = 'cda883fa7d79f5a70cf2e2b45149d2ccb2acc94caaa297679dccc7085cf3d097';

exports.allMusics = async (req, res, next) => {
    try {
        const page = req.query.page * 1 || 1;
        const limit = req.query.limit * 1 || 20;

        const musics = await Music.find()
            .skip((page - 1) * limit)
            .limit(limit);

        res.status(200).json({
            musics
        });
    }
    catch (err) {
        next(new MyError(err, 500));
    }
}

exports.musicCount = async (req, res, next) => {
    try {
        const count = await Music.find().count();
        res.status(200).json({
            count
        });
    }
    catch (err) {
        next(new MyError(err, 500));
    }
}

exports.musicSearch = async (req, res, next) => {
    try {
        const word = req.query.q;
        if(!word) return next(new MyError('لطفا عبارتی را برای جست و جو وارد نمایید.', 400));
        
        // const regex = new RegExp('.*' + word + '.*', 'i');

        // const musics = await Music.find({
        //     title: { $regex: regex }
        // });

        const musics = await Music.fuzzySearch(word);

        res.status(200).json({
            musics
        });
    }
    catch (err) {
        next(new MyError(err, 500));
    }
}

exports.uploadMusic = async (req, res, next) => {
    try {
        if (req.user.role !== 'admin') return next(new MyError('متاسفانه شما برای انجام این کار دسترسی ندارید.', 403));

        const title = req.body.title;

        const artists = req.body.artist.split(',');
        artists.forEach((el, index, arr) => {
            arr[index] = el.trim();
        });

        const categories = req.body.category.split(',');
        categories.forEach((el, index, arr) => {
            arr[index] = el.trim();
        });

        if (!req.files.music) {
            return next(new MyError('لطفا آهنگ مورد نظر را آپلود نمایید.', 400));
        }

        const coverImg = req.files.coverImage;
        let CIlink;
        if(coverImg){
            CIlink = 'uploads/coverImage/' + coverImg.name;
            const CIdir = __dirname + '/../public/' + CIlink;
            if (!coverImg.mimetype.match(/image/g))
                return next(new MyError('فایل انتخاب شده تصویر نمی‌باشد. لطفا یک فایل معتبر برای تصویر آهنگ آپلود کنید.'), 400);
            await coverImg.mv(CIdir);
            CIlink = 'https://music-pwa-api.iran.liara.run/' + CIlink;
    }

        const desc = req.body.desc;

        const musicFile = req.files.music;
        const link = 'uploads/musics/' + musicFile.name;
        const dir = __dirname + '/../public/' + link;
        console.log(musicFile.mimetype);
        if (!musicFile.mimetype.match(/audio/g))
            return next(new MyError('فایل انتخاب شده آهنگ نیست. لطفا یک فایل معتبر با پسوند آهنگ آپلود کنید.'), 400);
        await musicFile.mv(dir);
        // const tags = await awaitableJsmediatags(dir);
        // console.log(tags);

        const music = await Music.create({
            title,
            artist: artists,
            musicPath: 'https://music-pwa-api.iran.liara.run/' + link,
            category: categories,
            description: desc,
            coverImagePath: CIlink
        });

        let status = false;
        if (music) status = true;

        res.status(200).json({
            status
        });
    }
    catch (err) {
        next(new MyError(err, 500));
    }
}

exports.addToPlayList = async (req, res, next) => {
    try {
        const user = req.user;
        if (user) {
            if (req.body.playlist === undefined || req.body.music === undefined)
                return next(new MyError('playlist name or music id must speciy.', 400));
            const newPlayList = user.playLists;
            const playlist = req.body.playlist;
            const music = req.body.music;

            const list = [];
            if (newPlayList[playlist] === undefined)
                list.push(music);
            else {
                for (let i = 0; newPlayList[playlist][i] !== undefined; ++i)
                    list.push(newPlayList[playlist][i]);
                list.push(music);
            }
            newPlayList[playlist] = list;

            await user.updateOne({
                playLists: newPlayList
            }, { runValidators: true, new: true });
        }

        res.status(200).json({
            user
        });
    }
    catch (err) {
        next(new MyError(err, 500));
    }
}

exports.like = async (req, res, next) => {
    try {
        const musicID = req.params.id;
        const music = await Music.findById(musicID);

        const decodedToken = await promisify(jwt.verify)(req.body.jwtToken, secret);
        const userID = decodedToken.id;

        if (music.likes.includes(userID)) {
            for (let i = 0; i < music.likes.length; i++)
                if (music.likes[i] === userID)
                    music.likes.splice(i, 1);
        }
        else music.likes.push(userID);

        music.save();

        res.end();
    }
    catch (err) {
        next(new MyError(err, 500));
    }
}
