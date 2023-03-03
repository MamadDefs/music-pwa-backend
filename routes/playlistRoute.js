const express = require('express');
const playlistRouteHandler = require('../routeHandlers/playlistRouteHandler');
const globalRouteHandler = require('../routeHandlers/globalRouteHandler');

const playlistRouter = new express.Router();

playlistRouter.post('/', globalRouteHandler.protectRoutes, playlistRouteHandler.playlists);

playlistRouter.post('/id/:id', playlistRouteHandler.playlistById);

playlistRouter.post('/create', globalRouteHandler.protectRoutes, playlistRouteHandler.createPlaylist);

playlistRouter.post('/add-to-playlist', globalRouteHandler.protectRoutes, playlistRouteHandler.addToPlayList);

playlistRouter.post('/delete-music', globalRouteHandler.protectRoutes, playlistRouteHandler.deleteFromPlaylist);

playlistRouter.post('/delete', globalRouteHandler.protectRoutes, playlistRouteHandler.deletePlaylist);

module.exports = playlistRouter;