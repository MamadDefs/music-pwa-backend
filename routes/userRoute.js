const express = require('express');
const userRouteHandler = require('../routeHandlers/userRouteHandler');
const globalRouteHandler = require('../routeHandlers/globalRouteHandler');

const userRouter = new express.Router();

userRouter.route('/sign-up').post(globalRouteHandler.reSignInUpCheck, userRouteHandler.signUpSubmission);

userRouter.get('/activate-email/:token', userRouteHandler.activateEmail);

userRouter.route('/sign-in').post(globalRouteHandler.reSignInUpCheck, userRouteHandler.signInSubmission);

userRouter.post('/auth', userRouteHandler.auth);

userRouter.get('/logout', userRouteHandler.logOut)

userRouter.route('/reset-password').get(userRouteHandler.resetPasswordGetEmail)
.post(userRouteHandler.resetPasswordSendEmail);
userRouter.route('/reset-password/:token').get(userRouteHandler.resetPasswordForm)
.post(userRouteHandler.resetPasswordSubmission);

userRouter.get('/profile', globalRouteHandler.protectRoutes, userRouteHandler.userProfile);
userRouter.post('/profile/upload-image', globalRouteHandler.protectRoutes, userRouteHandler.uploadProfileImage);

module.exports = userRouter;