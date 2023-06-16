exports.up = (pgm) => {
  pgm.addConstraint(
    'user_album_likes',
    'unique_user_id_and_album_id',
    'UNIQUE("userId", "albumId")',
  );

  pgm.addConstraint(
    'user_album_likes',
    'fk_user_album_likes.user_id_users.id',
    'FOREIGN KEY("userId") REFERENCES users(id) ON DELETE CASCADE',
  );

  pgm.addConstraint(
    'user_album_likes',
    'fk_user_album_likes.album_id_albums.id',
    'FOREIGN KEY("albumId") REFERENCES albums(id) ON DELETE CASCADE',
  );
};

exports.down = (pgm) => {
  pgm.dropConstraint('user_album_likes', 'unique_user_id_and_album_id');
  pgm.dropConstraint('user_album_likes', 'fk_user_album_likes.user_id_users.id');
  pgm.dropConstraint('user_album_likes', 'fk_user_album_likes.album_id_albums.id');
};
