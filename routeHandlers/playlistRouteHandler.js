const User = require('../models/userModel');
const Music = require('../models/musicModel');
const Playlist = require('../models/playlistModel');
const MyError = require('../utilities/myError');

exports.playlists = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user) return next(new MyError('لطفا ابتدا وارد حساب کاربری خود شوید.', 401));

        const userID = user.id;

        const playlists = await Playlist.find({
            owner: userID
        });

        const playlistWithMusics = [];
        for(let j = 0; j < playlists.length; j++){
            const title = playlists[j].title;
            const musics = [];
            for(let i = 0; i < playlists[j].musics.length; i++){
                const music = await Music.findById(playlists[j].musics[i]);
                musics.push(music);
            }
            const record = {
                title,
                musics
            }
            playlistWithMusics.push(record);
        }

        res.status(200).json({
            playlistWithMusics
        });
    }
    catch (err) {
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

        const title = req.body.title;
        const msuicID = req.body.music;
        const userID = user.id;

        const playlist = await Playlist.findOne({
            title: title,
            owner: userID
        });

        const list = playlist.musics;
        list.push(msuicID);

        await playlist.updateOne({
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