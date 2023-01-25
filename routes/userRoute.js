const express = require('express');
const userRouteHandler = require('../routeHandlers/userRouteHandler');

const userRouter = new express.Router();

userRouter.route('/sign-up').post(userRouteHandler.reSignInUpCheck, userRouteHandler.signUpSubmission);

userRouter.get('/activate-email/:token', userRouteHandler.activateEmail);

userRouter.route('/sign-in').post(userRouteHandler.reSignInUpCheck, userRouteHandler.signInSubmission);

userRouter.post('/auth', userRouteHandler.auth);

userRouter.get('/logout', userRouteHandler.logOut)

userRouter.route('/reset-password').get(userRouteHandler.resetPasswordGetEmail)
.post(userRouteHandler.resetPasswordSendEmail);
userRouter.route('/reset-password/:token').get(userRouteHandler.resetPasswordForm)
.post(userRouteHandler.resetPasswordSubmission);

userRouter.get('/profile', userRouteHandler.protectRoutes, userRouteHandler.userProfile);
userRouter.post('/profile/upload-image', userRouteHandler.protectRoutes, userRouteHandler.uploadProfileImage);

userRouter.route('/playlist').post(userRouteHandler.protectRoutes, userRouteHandler.addToPlayList);

userRouter.route('/admin').get(userRouteHandler.adminPanel)
.post(userRouteHandler.protectRoutes, userRouteHandler.adminUploadMusic);

module.exports = userRouter;