/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  /*
    Menambahkan constraint UNIQUE, kombinasi dari kolom playlist_id dan song_id.
    Guna menghindari duplikasi data antara nilai keduanya.
  */
  pgm.addConstraint(
    'playlist_songs',
    'unique_playlist_id_and_song_id',
    'UNIQUE("playlistId", "songId")'
  );
  /*
    Memberikan constraint foreign key pada kolom playlist_id dan song_id
    terhadap playlists.id dan songs.id
  */
  pgm.addConstraint(
    'playlist_songs',
    'fk_playlist_songs.playlist_id_playlists.id',
    'FOREIGN KEY("playlistId") REFERENCES playlists(id) ON DELETE CASCADE'
  );

  pgm.addConstraint(
    'playlist_songs',
    'fk_playlist_songs.song_id_songs.id',
    'FOREIGN KEY("songId") REFERENCES songs(id) ON DELETE CASCADE'
  );
};

exports.down = pgm => {
  pgm.dropConstraint('playlist_songs', 'fk_playlist_songs.playlist_id_playlists.id');
  pgm.dropConstraint('playlist_songs', 'fk_playlist_songs.song_id_songs.id');
  pgm.dropConstraint('playlist_songs', 'unique_playlist_id_and_song_id');
};
