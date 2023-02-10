const express = require('express');
const musicRouteHandler = require('../routeHandlers/musicRouteHandler');
const globalRouteHandler = require('../routeHandlers/globalRouteHandler');

const musicRouter = new express.Router();

musicRouter.get('/all', musicRouteHandler.allMusics);
musicRouter.get('/count', musicRouteHandler.musicCount);
musicRouter.get('/search', musicRouteHandler.musicSearch);

musicRouter.post('/upload-music', globalRouteHandler.protectRoutes, musicRouteHandler.uploadMusic);

musicRouter.post('/add-to-playlist', globalRouteHandler.protectRoutes, musicRouteHandler.addToPlayList);

musicRouter.post('/like/:id', globalRouteHandler.protectRoutes, musicRouteHandler.like);

module.exports = musicRouter;