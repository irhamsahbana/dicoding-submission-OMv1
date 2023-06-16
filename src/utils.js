const mapDBToModelPlaylist = (data) => {
  const playlist = {
    id: data[0].id,
    name: data[0].name,
    songs: [],
  };

  data.forEach((el) => {
    const song = {
      id: el.songId,
      title: el.title,
      performer: el.performer,
    };

    playlist.songs.push(song);
  });

  return playlist;
};

module.exports = mapDBToModelPlaylist;
