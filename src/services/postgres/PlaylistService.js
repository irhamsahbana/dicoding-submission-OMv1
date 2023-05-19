const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const { mapDBToModelActivity } = require('../../utils');

const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');

class PlaylistService {
  constructor(collaborationService) {
    this._pool = new Pool();
    this._collaborationService = collaborationService;
  }

  async addPlaylist({ name, owner }) {
    const id = nanoid(16);

    const query = {
      text: 'INSERT INTO playlists(id, owner, name) VALUES($1, $2, $3) RETURNING id',
      values: [id, owner, name],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) throw new InvariantError('Playlist gagal ditambahkan');

    return result.rows[0].id;
  }

  async getPlaylists(owner) {
    const query = {
      text: `
      SELECT playlists.*, users.username FROM playlists
      LEFT JOIN collaborations ON collaborations."playlistId" = playlists.id
      LEFT JOIN users ON users.id = playlists.owner
      WHERE playlists.owner = $1 OR collaborations."userId" = $1
      GROUP BY playlists.id, users.username`,
      values: [owner],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async deletePlaylistById(id) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) throw new NotFoundError('Playlist gagal dihapus. Id tidak ditemukan');
  }

  async addPlaylistActivity(playlistId, songId, userId, action) {
    const id = `song-activities-${nanoid(16)}`;
    const time = new Date().toISOString();
    const query = {
      text: 'INSERT INTO playlist_song_activities VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
      values: [id, playlistId, songId, userId, action, time],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) throw new InvariantError('Song Activity gagal ditambahkan');

    return result.rows[0].id;
  }

  async getPlaylistActivities(id) {
    const query = {
      text: `
      SELECT playlist_song_activities.*, playlists.id, users.username, songs.title
      FROM playlist_song_activities
      LEFT JOIN playlists ON playlists.id = playlist_song_activities."playlistId"
      LEFT JOIN users on users.id = playlist_song_activities."userId"
      LEFT JOIN songs ON songs.id = playlist_song_activities."songId"
      WHERE playlist_song_activities."playlistId" = $1
      ORDER BY time asc`,
      values: [id],
    };
    const result = await this._pool.query(query);
    const activity = mapDBToModelActivity(result.rows);
    return activity;
  }

  async verifyPlaylistOwner(id, owner) {
    const query = {
      text: 'SELECT * FROM playlists WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) throw new NotFoundError('Playlist tidak ditemukan');

    const playlist = result.rows[0];

    if (playlist.owner !== owner) throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
  }

  async verifyPlaylistAccess(playlistId, userId) {
    try {
      await this.verifyPlaylistOwner(playlistId, userId);
    } catch (error) {
      if (error instanceof NotFoundError) throw error;

      try {
        await this._collaborationService.verifyCollaborator(playlistId, userId);
      } catch {
        throw error;
      }
    }
  }
}

module.exports = PlaylistService;
