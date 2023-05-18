const { Pool } = require('pg');
const { nanoid } = require('nanoid');

const { mapDBToModelPlaylist } = require('../../utils');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class PlaylistSongService {
  constructor(songService) {
    this._pool = new Pool();
    this._songService = songService;
  }

  async addPlaylistSong(playlistId, songId) {
    const id = `playlistSong-${nanoid(16)}`;

    await this._songService.getSongById(songId);

    const query = {
      text: 'INSERT INTO playlist_songs(id, "playlistId", "songId") VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) throw new InvariantError('Playlist song gagal ditambahkan');

    return result.rows[0].id;
  }

  async getPlaylistSongById(id) {
    const query = {
      text: `
      SELECT playlist_songs.*, songs.title, songs.performer, playlists.*, users.username
      FROM playlist_songs
      LEFT JOIN songs ON songs.id = playlist_songs."songId"
      LEFT JOIN playlists ON playlists.id = playlist_songs."playlistId"
      LEFT JOIN users on users.id = playlists.owner
      WHERE playlist_songs."playlistId" = $1`,
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) throw new NotFoundError('Playlist tidak ditemukan');

    const playlist = mapDBToModelPlaylist(result.rows);

    return playlist;
  }

  async deletePlaylistSong(playlistId, songId) {
    const query = {
      text: 'DELETE FROM playlist_songs WHERE "playlistId" = $1 AND "songId" = $2 RETURNING id',
      values: [playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) throw new InvariantError('Playlist song gagal dihapus');
  }
}

module.exports = PlaylistSongService;