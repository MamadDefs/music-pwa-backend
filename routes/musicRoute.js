const express = require('express');
const musicRouteHandler = require('../routeHandlers/musicRouteHandler');
const globalRouteHandler = require('../routeHandlers/globalRouteHandler');

const musicRouter = new express.Router();

musicRouter.get('/all', musicRouteHandler.allMusics);
musicRouter.get('/count', musicRouteHandler.musicCount);
musicRouter.get('/search', musicRouteHandler.musicSearch);

musicRouter.post('/upload-music', globalRouteHandler.protectRoutes, musicRouteHandler.uploadMusic);

musicRouter.post('/like/:id', globalRouteHandler.protectRoutes, musicRouteHandler.like);

musicRouter.post('/artist', musicRouteHandler.artist);

musicRouter.post('/category', musicRouteHandler.category);

module.exports = musicRouter;