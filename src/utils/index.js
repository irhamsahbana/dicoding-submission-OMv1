const config = require('./config');

const mapAlbumSongs = (results) => {
  const album = {
    id: results[0].id,
    name: results[0].name,
    year: results[0].year,
    coverUrl: null,
    songs: [],
  };

  if (results[0].coverUrl !== null) {
    album.coverUrl = `http://${config.app.host}:${config.app.port}/uploads/images/${results[0].coverUrl}`;
  }

  results.forEach((song) => {
    if (song.songId) {
      album.songs.push({
        id: song.songId,
        title: song.title,
        performer: song.performer,
      });
    }
  });

  return album;
};

const mapDBToModelPlaylist = (dataFromDB) => {
  const playlist = {
    id: dataFromDB[0].id,
    name: dataFromDB[0].name,
    username: dataFromDB[0].username,
    songs: [],
  };

  dataFromDB.forEach((el) => {
    const song = {
      id: el.songId,
      title: el.title,
      performer: el.performer,
    };

    playlist.songs.push(song);
  });

  return playlist;
};

const mapDBToModelActivity = (dataFromDB) => {
  const data = {
    playlistId: dataFromDB[0].id,
    activities: [],
  };

  dataFromDB.forEach((el) => {
    const activity = {
      username: el.username,
      title: el.title,
      action: el.action,
      time: el.time,
    };

    data.activities.push(activity);
  });
  return data;
};

module.exports = {
  mapAlbumSongs,
  mapDBToModelPlaylist,
  mapDBToModelActivity,
};
