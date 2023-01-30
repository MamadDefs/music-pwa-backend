const User = require('../models/userModel');
const Music = require('../models/musicModel');
const MyError = require('../utilities/myError');

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