exports.up = pgm => {
    pgm.addConstraint(
      'collaborations',
      'unique_playlist_id_and_user_id',
      'UNIQUE("playlistId", "userId")'
    );

    pgm.addConstraint(
      'collaborations',
      'fk_collaborations.playlist_id_playlists.id',
      'FOREIGN KEY("playlistId") REFERENCES playlists(id) ON DELETE CASCADE'
    );

    pgm.addConstraint(
      'collaborations',
      'fk_collaborations.user_id_users.id',
      'FOREIGN KEY("userId") REFERENCES users(id) ON DELETE CASCADE'
    );
};

exports.down = pgm => {
    pgm.dropConstraint('collaborations', 'fk_collaborations.playlist_id_playlists.id');
    pgm.dropConstraint('collaborations', 'fk_collaborations.user_id_users.id');
    pgm.dropConstraint('collaborations', 'unique_playlist_id_and_user_id');
};
