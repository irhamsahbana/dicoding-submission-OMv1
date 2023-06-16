const { Pool } = require('pg');
const mapDBToModelPlaylist = require('./utils');

class PlaylistSongService {
  constructor() {
    this._pool = new Pool();
  }

  async getPlaylistSongById(playlistId) {
    const query = {
      text: `SELECT playlist_songs.*, songs.title, songs.performer, playlists.*
      FROM playlist_songs
      LEFT JOIN songs ON songs.id = playlist_songs."songId"
      LEFT JOIN playlists ON playlists.id = playlist_songs."playlistId"
      WHERE playlist_songs."playlistId" = $1`,
      values: [playlistId],
    };
    const result = await this._pool.query(query);
    const playlist = mapDBToModelPlaylist(result.rows);
    return { playlist };
  }
}

module.exports = PlaylistSongService;
