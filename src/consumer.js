require('dotenv').config();
const amqp = require('amqplib');
const PlaylistsService = require('./PlaylistsService');
const MailSender = require('./MailSender');
const Listener = require('./listener');
 
const init = async () => {
  const PLAYLIST_EXPORT_QUEUE = 'export:playlist';
  const playlistsService = new PlaylistsService();
  const mailSender = new MailSender();
  const listener = new Listener(playlistsService, mailSender);
 
  const connection = await amqp.connect(process.env.RABBITMQ_SERVER);
  const channel = await connection.createChannel();
 
  await channel.assertQueue(PLAYLIST_EXPORT_QUEUE, {
    durable: true,
  });
 
  channel.consume(PLAYLIST_EXPORT_QUEUE, listener.listen, { noAck: true });
};
 
init();