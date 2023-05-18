const mapAlbumSongs = (results) => {
  album = {
    id: results[0].id,
    name: results[0].name,
    year: results[0].year,
    songs: []
  }

  results.forEach(song => {
    if (song.songId)
      album.songs.push({
        id: song.songId,
        title: song.title,
        performer: song.performer
      })
  });

  return album;
}

module.exports = { mapAlbumSongs };