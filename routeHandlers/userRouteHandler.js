const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jsmediatags = require('jsmediatags');
const { promisify } = require('util');
const User = require('../models/userModel');
const Music = require('../models/musicModel');
const sendMail = require('../utilities/sendMail');
const MyError = require('../utilities/myError');

const secret = 'cda883fa7d79f5a70cf2e2b45149d2ccb2acc94caaa297679dccc7085cf3d097';

awaitableJsmediatags = (filename) => {
    return new Promise((resolve, reject) => {
        jsmediatags.read(filename, {
            onSuccess: (tag) => {
                resolve(tag);
            },
            onError: (err) => {
                reject(err);
            }
        });
    });
}

exports.signUpSubmission = async (req, res, next) => {
    try {
        const user = await User.create({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            passwordConfirm: req.body.passwordConfirm
        });
        const token = jwt.sign({ id: user._id, username: user.username }, secret, {
            expiresIn: '90d'
        });
        // res.cookie('jwtToken', token, {
        //     maxAge: 90 * 24 * 60 * 60 * 1000,
        //     httpOnly: true
        // });

        res.status(200).json({
            user,
            token
        });
    }
    catch (err) {
        next(new MyError(err, 500));
    }
}

exports.activateEmail = async (req, res, next) => {
    try {
        const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
        const user = await User.findOneAndUpdate({
            activationToken: hashedToken
        },
            {
                isActivated: true,
                activationToken: null
            }, { runValidators: true, new: true });
        if (!user) return next(new MyError('کاربر یافت نشد یا حساب کاربری قبلا فعال شده است.', 400));

        res.status(200).json({
            user
        });
    }
    catch (err) {
        next(new MyError(err, 500));
    }
}

exports.signInSubmission = async (req, res, next) => {
    try {
        const user = await User.findOne({
            username: req.body.username
        }).select('+password');
        if (!user || !await bcrypt.compare(req.body.password, user.password))
            return next(new MyError('نام کاربری یا رمز عبور اشتباه است. لطفا دوباره تلاش کنید.', 401));

        const token = jwt.sign({ id: user._id, username: user.username }, secret, {
            expiresIn: '90d'
        });
        // res.cookie('jwtToken', token, {
        //     maxAge: 90 * 24 * 60 * 60 * 1000,
        //     httpOnly: true
        // });

        let userRole = user.role === 'admin' ? 'admin' : (user.role === 'user' ? 'user' : undefined);

        res.status(200).json({
            userRole,
            token
        });
    }
    catch (err) {
        next(new MyError(err, 500));
    }
}

exports.auth = async (req, res, next) => {
    try {
        const user = await getLogedInUser(req.body.jwtToken);
        if (user)
            res.status(200).json({
                isLogin: true,
                user
            });
        else
            res.status(200).json({
                isLogin: false
            });
    }
    catch (err) {
        res.status(403);
    }
}

exports.logOut = (req, res, next) => {
    res.clearCookie('jwtToken');

    res.end();
}

exports.resetPasswordGetEmail = (req, res, next) => {
    res.status(200).send(
        `<form action="/users/reset-password" method="post">
            <input type="text" name="email" placeholder="Email" required>
            <input type="submit" value="submit">
        </form>`
    );
}

exports.resetPasswordSendEmail = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) return next(new MyError('User not found', 404));

        const resetToken = user.createResetToken();
        await user.save({ validateBeforeSave: false });

        const resetURL = `http://127.0.0.1:3000/users/reset-password/${resetToken}`;
        const msg = `Please click the following URL to reset your password. (This URL will expire after 15 minutes!!!)\nIf you don't request for reseting password ignore this Email.\n${resetURL}`;
        await sendMail.sendMail({
            email: user.email,
            subject: 'Reseting Password',
            message: msg
        });

        res.status(200).json({
            message: 'Email sent to user'
        });
    }
    catch (err) {
        next(new MyError(err, 500));
    }
}

exports.resetPasswordForm = (req, res, next) => {
    res.status(200).send(
        `<form action="/users${req.url}" method="post">
            <input type="password" name="password" placeholder="New Password" required>
            <input type="password" name="passwordConfirm" placeholder="New Password Confirmation" required>
            <input type="submit" value="submit">
        </form>`
    );
}

exports.resetPasswordSubmission = async (req, res, next) => {
    try {
        const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpiredTime: { $gt: Date.now() }
        });
        if (!user) return next(new MyError('توکن ارسال شده نامعتبر می‌باشد.', 401));

        user.password = req.body.password;
        user.passwordConfirm = req.body.passwordConfirm;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiredTime = undefined;
        await user.save();

        const token = jwt.sign({ id: user._id, username: user.username }, secret, {
            expiresIn: '90d'
        });
        res.cookie('jwtToken', token, {
            maxAge: 90 * 24 * 60 * 60 * 1000,
            httpOnly: true
        });

        res.status(200).json({
            message: 'رمز عبور با موفقیت تغییر یافت.'
        });
    }
    catch (err) {
        next(new MyError(err, 500));
    }
}

exports.userProfile = async (req, res, next) => {
    try {
        res.status(200).json({
            user: req.user
        });
    }
    catch (err) {
        next(new MyError(err, 500));
    }
}

exports.uploadProfileImage = async (req, res, next) => {
    try {
        const user = req.user;
        //if (!user) return next(new MyError('Please log in', 403));

        if (!req.files.profileImage) {
            return next(new MyError('لطفا یک تصویر آپلود کنید.', 400));
        }
        const img = req.files.profileImage;
        const link = 'uploads/images/' + img.name;
        const dir = __dirname + '/../public/' + link;
        console.log(img.mimetype);
        if (!img.mimetype.match(/image/g))
            return next(new MyError('فایل انتخاب شده تصویر نمی‌باشد. لطفا یک تصویر معتبر آپلود کنید.'), 400);

        await img.mv(dir);

        await user.updateOne({
            profileImage: 'https://music-pwa-api.iran.liara.run/' + link
        }, { runValidators: true, new: true });

        res.status(200).json({
            user
        });
    }
    catch (err) {
        next(new MyError(err, 500));
    }
}

exports.adminPanel = async (req, res, next) => {
    try {

    }
    catch (err) {
        next(new MyError(err, 500));
    }
}