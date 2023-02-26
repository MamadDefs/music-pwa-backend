const jwt = require('jsonwebtoken');
const {promisify} = require('util');
const User = require('../models/userModel');
const Music = require('../models/musicModel');
const MyError = require('../utilities/myError');

const secret = 'cda883fa7d79f5a70cf2e2b45149d2ccb2acc94caaa297679dccc7085cf3d097';

getLogedInUser = async (token) => {
    try {
        if(token){
            const decodedToken = await promisify(jwt.verify)(token, secret);
            const user = await User.findById(decodedToken.id);
            return user;
        }
        else return undefined;
    }
    catch(err) {
        next(new MyError(err, 500));
    }
}

exports.reSignInUpCheck = async (req, res, next) => {
    try{
        const user = await getLogedInUser(req.body.jwtToken);
        if(user) {
            req.user = user;
            return res.status(403).json({
                error: 'شما قبلا وارد حساب کاربری خود شده‌اید.'
            });
        }
        else next();
    }
    catch(err){
        next(new MyError(err, 500));
    }
}

exports.protectRoutes = async (req, res, next) => {
    try{
        const user = await getLogedInUser(req.body.jwtToken);
        if(user) {
            req.user = user;
            next();
        }
        else res.status(403).json({
            error: 'شما به حساب کاربری خود وارد نشده‌اید. لطفا برای ادامه وارد حساب کاربری خود شوید.'
        });
    }
    catch(err){
        next(new MyError(err, 500));
    }
}