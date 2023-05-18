const { nanoid } = require('nanoid');
const { Pool } = require('pg');

const NotFoundError = require('../../exceptions/NotFoundError');

class SongService {
  constructor() {
    this._pool = new Pool();
  }

  async getSongs({ title, performer }) {
    let query = {
      text: 'SELECT id, title, performer FROM songs',
    };

    if (title !== undefined) {
      query = {
        text: 'SELECT id, title, performer FROM songs WHERE title ILIKE $1',
        values: [`%${title}%`],
      };
    }

    if (performer !== undefined) {
      query = {
        text: 'SELECT id, title, performer FROM songs WHERE performer ILIKE $1',
        values: [`%${performer}%`],
      };
    }

    if (title !== undefined && performer !== undefined) {
      query = {
        text: 'SELECT id, title, performer FROM songs WHERE title ILIKE $1 AND performer ILIKE $2',
        values: [`%${title}%`, `%${performer}%`],
      };
    }

    return (await this._pool.query(query)).rows;
  }

  async addSong({ title, year, performer, genre, duration, albumId}) {
    const id = `song-${nanoid(16)}`;


    const query = {
      text: `
      INSERT INTO songs(id, title, year, performer, genre, duration, "albumId")
      VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
      values: [id, title, year, performer, genre, duration, albumId],
    };

    return (await this._pool.query(query)).rows[0].id;
  }

  async getSongById(id) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) throw new NotFoundError('Lagu tidak ditemukan');

    return result.rows[0];
  }

  async deleteSongById(id) {
    const query = {
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) throw new NotFoundError('Lagu gagal dihapus. Id tidak ditemukan');
  }

  async editSongById(id, { title, year, performer, genre, duration, albumId}) {
    const query = {
      text: `
      UPDATE songs
      SET title = $1, year = $2, performer = $3, genre = $4, duration = $5, "albumId" = $6
      WHERE id = $7
      RETURNING id`,
      values: [title, year, performer, genre, duration, albumId, id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) throw new NotFoundError('Gagal memperbarui lagu. Id tidak ditemukan');
  }

}

module.exports = SongService;