const express = require('express');
const musicRouteHandler = require('../routeHandlers/musicRouteHandler');
const globalRouteHandler = require('../routeHandlers/globalRouteHandler');

const musicRouter = new express.Router();

musicRouter.post('/upload-music');

musicRouter.post('/add-to-playlist', globalRouteHandler.protectRoutes, musicRouteHandler.addToPlayList);

musicRouter.post('/like/:id', globalRouteHandler.protectRoutes, musicRouteHandler.like);

module.exports = musicRouter;