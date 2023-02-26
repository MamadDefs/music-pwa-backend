const User = require('../models/userModel');
const Music = require('../models/musicModel');
const Playlist = require('../models/playlistModel');
const MyError = require('../utilities/myError');

exports.playlists = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user) return next(new MyError('لطفا ابتدا وارد حساب کاربری خود شوید.', 401));

        const userID = user._id;

        const playlists = await Playlist.find({
            owner: userID
        });

        // const playlistWithMusics = [];
        // for(let j = 0; j < playlists.length; j++){
        //     const title = playlists[j].title;
        //     const id = playlists[j]._id;
        //     const musics = [];
        //     for(let i = 0; i < playlists[j].musics.length; i++){
        //         const music = await Music.findById(playlists[j].musics[i]);
        //         musics.push(music);
        //     }
        //     const record = {
        //         id,
        //         title,
        //         musics
        //     }
        //     playlistWithMusics.push(record);
        // }

        res.status(200).json({
            playlists
        });
    }
    catch (err) {
        next(new MyError(err, 500));
    }
}

exports.playlistById = async (req, res, next) => {
    try {
        const playlistID = req.params.id;
        const playlist = await Playlist.findById(playlistID);

        const musics = [];
        for(let i = 0; i < playlist.musics.length; i++){
            const music = await Music.findById(playlist.musics[i]);
            musics.push(music);
        }

        res.status(200).json({
            playlist: {
                title: playlist.title,
                musics
            }
        });
    }
    catch(err) {
        next(new MyError(err, 500));
    }
}

exports.createPlaylist = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user) return next(new MyError('لطفا ابتدا وارد حساب کاربری خود شوید.', 401));

        const title = req.body.title;
        const userID = user.id;

        const playlist = await Playlist.create({
            title: title,
            owner: userID
        });

        res.status(200).json({
            playlist
        });
    }
    catch(err) {
        next(new MyError(err, 500));
    }
}

exports.addToPlayList = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user) return next(new MyError('لطفا ابتدا وارد حساب کاربری خود شوید.', 401));

        const playlistID = req.body.playlistID;
        const musicID = req.body.music;
        const userID = user.id;

        const playlist = await Playlist.findById(playlistID);

        const list = playlist?.musics || [];
        if(list.includes(musicID)) return next(new MyError('این موسیقی قبلا در این پلی‌لیست وجود دارد.', 400));
        list.push(musicID);

        await playlist?.updateOne({
            musics: list
        }, {runValidators: true, new: true});

        res.status(200).json({
            playlist
        });
    }
    catch (err) {
        next(new MyError(err, 500));
    }
}