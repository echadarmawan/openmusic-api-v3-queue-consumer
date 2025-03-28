class Listener {
  constructor(playlistsService, mailSender) {
    this._playlistsService = playlistsService;
    this._mailSender = mailSender;
 
    this.listen = this.listen.bind(this);
  }
 
  async listen(message) {
    try {
      const { playlistId, targetEmail } = JSON.parse(message.content.toString());
      
      // memanggil lagu-lagu dalam suatu playlist dan sendEmail
      const playlist = await this._playlistsService.getSongs(playlistId);

      // jika playlist tidak ditemukan, kirimkan pesan kesalahan
      if (!playlist) {
        console.log('Playlist tidak ditemukan');
        return;
      }

      // mengirimkan email dengan format JSON yang sesuai
      const result = await this._mailSender.sendEmail(targetEmail, JSON.stringify({ playlist }));
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  }
}
 
module.exports = Listener;