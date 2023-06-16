class Listener {
  constructor(playlistSongService, mailSender) {
    this._playlistSongsService = playlistSongService;
    this._mailSender = mailSender;

    this.listen = this.listen.bind(this);
  }

  async listen(message) {
    try {
      const { playlistId, targetEmail } = JSON.parse(message.content.toString());

      const playlists = await this._playlistSongsService.getPlaylistSongById(playlistId);
      const result = await this._mailSender.sendEmail(targetEmail, JSON.stringify(playlists));
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = Listener;
