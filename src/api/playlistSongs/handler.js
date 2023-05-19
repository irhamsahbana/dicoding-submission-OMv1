const autoBind = require('auto-bind');

class PlaylistSongHandler {
  constructor(service, playlistService, validator) {
    this._service = service;
    this._playlistService = playlistService;
    this._validator = validator;

    autoBind(this);
  }

  async postPlaylistSongHandler(request, h) {
    this._validator.validatePlaylistSongPayload(request.payload);

    const { id: credentialId } = request.auth.credentials;
    const { songId } = request.payload;
    const { id: playlistId } = request.params;

    await this._playlistService.verifyPlaylistAccess(playlistId, credentialId);
    const playlistSongId = await this._service.addPlaylistSong(playlistId, songId);
    await this._playlistService.addPlaylistActivity(
      playlistId,
      songId,
      credentialId,
      'add',
    );

    const response = h.response({
      status: 'success',
      message: 'Playlist song berhasil ditambahkan',
      data: {
        playlistSongId,
      },
    }).code(201);

    return response;
  }

  async getPlaylistSongByIdHandler(request) {
    const { id: credentialId } = request.auth.credentials;
    const { id: playlistId } = request.params;

    await this._playlistService.verifyPlaylistAccess(playlistId, credentialId);
    const playlist = await this._service.getPlaylistSongById(playlistId);

    return {
      status: 'success',
      data: {
        playlist,
      },
    };
  }

  async deletePlaylistSongHandler(request) {
    this._validator.validatePlaylistSongPayload(request.payload);
    const { id: credentialId } = request.auth.credentials;
    const { songId } = request.payload;
    const { id: playlistId } = request.params;

    await this._playlistService.verifyPlaylistAccess(playlistId, credentialId);
    await this._service.deletePlaylistSong(playlistId, songId);
    await this._playlistService.addPlaylistActivity(
      playlistId,
      songId,
      credentialId,
      'delete',
    );

    return {
      status: 'success',
      message: 'Playlist Song berhasil dihapus',
    };
  }
}

module.exports = PlaylistSongHandler;
