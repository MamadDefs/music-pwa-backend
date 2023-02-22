const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const sendMail = require('../utilities/sendMail');
const MyError = require('../utilities/myError');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please provide an username.'],
        unique: true,
        minlength: [3, 'Username must have at least 3 character']
    },
    email: {
        type: String,
        required: [true, 'Please provide an Email.'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid Email.']
    },
    password: {
        type: String,
        required: [true, 'Please provide a password.'],
        minlength: 8,
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Plaese provide a Confirmation password'],
        select: false,
        validate: {
            validator: function(el) {
                return el === this.password;
            },
            message: 'passwords are not same!'
        }
    },
    passwordLastChangeTime: Date,
    resetPasswordToken: String,
    resetPasswordExpiredTime: Date,
    role: {
        type: String,
        default: 'user',
        enum: ['admin', 'user', 'premium']
    },
    isActivated: {
        type: Boolean,
        default: false
    },
    activationToken: String,
    profileImage: String
});

userSchema.pre('save', async function(next) {
    try{
        this.wasNew = this.isNew;
        if(!this.isModified('password')) return next();
        const encryptedPassword = await bcrypt.hash(this.password, 12);
        this.password = encryptedPassword;
        this.passwordConfirm = undefined;

        next();
    }
    catch(err){
        next(new MyError(err));
    }
});

userSchema.pre('save', function(next) {
    if(!this.isModified('password') || this.isNew) return next();
    this.passwordLastChangeTime = Date.now() - 1000;
    next();
});

userSchema.post('save', async function(doc, next){
    try{
        if(!this.wasNew) return next();
    
        const activationToken = this.createActivationToken();
        this.save({ validateBeforeSave: false });
        const activateURL = `http://127.0.0.1:3000/users/activate-email/${activationToken}`;
        const msg = `Please click the following URL to activate your account.\nIf you don't create an account in music pwa app please ignore this email.\n${activateURL}`;
        await sendMail.sendMail({
            email: this.email,
            subject: 'Activation Email',
            message: msg
        });
    }
    catch(err){
        next(new MyError(err, 500));
    }
});

userSchema.methods.createResetToken = function(){
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.resetPasswordExpiredTime = Date.now() + 15 * 60 * 1000;
    return resetToken;
}

userSchema.methods.createActivationToken = function(){
    const activationToken = crypto.randomBytes(32).toString('hex');
    this.activationToken = crypto.createHash('sha256').update(activationToken).digest('hex');
    return activationToken;
}

const User = mongoose.model('User', userSchema);

module.exports = User;
