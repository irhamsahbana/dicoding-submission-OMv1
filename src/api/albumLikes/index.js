const AlbumLikeHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'albumLikes',
  version: '1.0.0',
  register: async (server, { service, albumService, validator }) => {
    const albumLikeHandler = new AlbumLikeHandler(service, albumService, validator);
    server.route(routes(albumLikeHandler));
  },
};
