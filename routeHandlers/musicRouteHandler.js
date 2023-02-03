const jwt = require('jsonwebtoken');
const {promisify} = require('util');
const User = require('../models/userModel');
const Music = require('../models/musicModel');
const MyError = require('../utilities/myError');

const secret = 'cda883fa7d79f5a70cf2e2b45149d2ccb2acc94caaa297679dccc7085cf3d097';

exports.addToPlayList = async (req, res, next) => {
    try {
        const user = req.user;
        if(user) {
            if(req.body.playlist === undefined || req.body.music === undefined)
                return next(new MyError('playlist name or music id must speciy.', 400));
            const newPlayList = user.playLists;
            const playlist = req.body.playlist;
            const music = req.body.music;
            
            const list = [];
            if(newPlayList[playlist] === undefined)
                list.push(music);
            else{
                for(let i = 0; newPlayList[playlist][i] !== undefined; ++i)
                    list.push(newPlayList[playlist][i]);
                list.push(music);
            }
            newPlayList[playlist] = list;
            
            await user.updateOne({
                playLists: newPlayList
            }, {runValidators: true, new: true});
        }

        res.status(200).json({
            user
        });
    }
    catch(err) {
        next(new MyError(err, 500));
    }
}

exports.like = async (req, res, next) => {
    try {
        const musicID = req.params.id;
        const music = await Music.findById(musicID);
        
        const decodedToken = await promisify(jwt.verify)(req.body.jwtToken, secret);
        const userID = decodedToken.id;

        if(music.likes.includes(userID)){
            for(let i = 0; i < music.likes.length; i++)
                if(music.likes[i] === userID)
                    music.likes.splice(i, 1);
        }
        else music.likes.push(userID);
        
        music.save();
        
        res.end();
    }
    catch(err) {
        next(new MyError(err, 500));
    }
}