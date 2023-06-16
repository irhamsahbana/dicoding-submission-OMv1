const autoBind = require('auto-bind');

class AlbumLikesHandler {
  constructor(service, albumService, validator) {
    this._service = service;
    this._albumService = albumService;
    this._validator = validator;

    autoBind(this);
  }

  async postAlbumLikeHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const { id: albumId } = request.params;

    await this._albumService.getAlbumById(albumId);
    await this._service.addAlbumLike(credentialId, albumId);

    const response = h.response({
      status: 'success',
      message: 'Album like berhasil ditambahkan',
    }).code(201);

    return response;
  }

  async getAlbumLikeByIdHandler(request, h) {
    const { id: albumId } = request.params;

    const { likes, isCache = 0 } = await this._service.getAlbumLikeById(albumId);

    const response = h.response({
      status: 'success',
      data: {
        likes: likes.length,
      },
    }).code(200);

    if (isCache) response.header('X-Data-Source', 'cache');

    return response;
  }

  async deleteAlbumLikeHandler(request) {
    const { id: credentialId } = request.auth.credentials;
    const { id: albumId } = request.params;

    await this._service.deleteAlbumLike(credentialId, albumId);

    return {
      status: 'success',
      message: 'Album like berhasil dihapus',
    };
  }
}

module.exports = AlbumLikesHandler;
