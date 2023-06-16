require('dotenv').config();
const amqp = require('amqplib');
const PlaylistSongService = require('./PlaylistSongService');
const MailSender = require('./MailSender');
const Listener = require('./Listener');
const config = require('./config');

const init = async () => {
  const playlistSongService = new PlaylistSongService();
  const mailSender = new MailSender();
  const listener = new Listener(playlistSongService, mailSender);

  const connection = await amqp.connect(config.rabbitMq.server);
  const channel = await connection.createChannel();

  await channel.assertQueue('export:playlists', {
    durable: true,
  });

  channel.consume('export:playlists', listener.listen, { noAck: true });
};

init();
