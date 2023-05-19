const CollaborationHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'collaborations',
  version: '1.0.0',
  register: async (server, { service, playlistService, validator }) => {
    const collaborationHandler = new CollaborationHandler(
      service,
      playlistService,
      validator,
    );
    server.route(routes(collaborationHandler));
  },
};
