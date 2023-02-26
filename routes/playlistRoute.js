const express = require('express');
const playlistRouteHandler = require('../routeHandlers/playlistRouteHandler');
const globalRouteHandler = require('../routeHandlers/globalRouteHandler');

const playlistRouter = new express.Router();

playlistRouter.post('/', globalRouteHandler.protectRoutes, playlistRouteHandler.playlists);

playlistRouter.post('/:id', globalRouteHandler.protectRoutes, playlistRouteHandler.playlistById);

playlistRouter.post('/create', globalRouteHandler.protectRoutes, playlistRouteHandler.createPlaylist);

playlistRouter.post('/add-to-playlist', globalRouteHandler.protectRoutes, playlistRouteHandler.addToPlayList);

module.exports = playlistRouter;