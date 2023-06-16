/* eslint-disable no-underscore-dangle */
const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');

class AlbumLikesService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async addLikeUnlike(userId, albumId) {
    const query = {
      text: 'SELECT * FROM user_album_likes WHERE "userId" = $1 AND "albumId" = $2',
      values: [userId, albumId],
    };

    const likeResult = await this._pool.query(query);

    if (!likeResult.rowCount) await this.addAlbumLike(userId, albumId);
    else await this.deleteAlbumLike(userId, albumId);

    await this._cacheService.delete(`likes:${albumId}`);
  }

  async addAlbumLike(userId, albumId) {
    const id = `albumLike-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO user_album_likes(id, "userId", "albumId") VALUES($1, $2, $3) RETURNING id',
      values: [id, userId, albumId],
    };
    try {
      await this._pool.query(query);
    } catch (error) {
      throw new InvariantError('User telah like');
    }

    await this._cacheService.delete(`likes:${albumId}`);
  }

  async getAlbumLikeById(albumId) {
    try {
      const result = await this._cacheService.get(`likes:${albumId}`);
      return { likes: JSON.parse(result), isCache: 1 };
    } catch (error) {
      const query = {
        text: 'SELECT user_id FROM user_album_likes WHERE album_id = $1',
        values: [albumId],
      };

      const { rows } = await this._pool.query(query);

      await this._cacheService.set(`likes:${albumId}`, JSON.stringify(rows));

      return { likes: rows };
    }
  }

  async deleteAlbumLike(userId, albumId) {
    const query = {
      text: 'DELETE FROM user_album_likes WHERE "userId" = $1 AND "albumId" = $2 RETURNING id',
      values: [userId, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) throw new InvariantError('Album like gagal dihapus');

    await this._cacheService.delete(`likes:${albumId}`);
  }
}

module.exports = AlbumLikesService;
