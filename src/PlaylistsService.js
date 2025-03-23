const { Pool } = require('pg');

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async getSongs(playlistId) {
    const query = {
      text: `SELECT p.id, p.name, u.username,
      s.id AS song_id, s.title AS song_title, s.performer AS song_performer FROM playlists p
      JOIN users u ON p.owner = u.id
      JOIN playlist_songs ps ON p.id = ps.playlist_id
      JOIN songs s ON ps.song_id = s.id
      WHERE p.id = $1`,
      values: [playlistId],
    };
    const result = await this._pool.query(query);

    // JIka tidak ada playlist, kembalikan kosong
    if (result.rows.length === 0) {
      return [];
    }

    // Mengelompokkan data berdasarkan playlist
    const playlist = {
      id: result.rows[0].id,
      name: result.rows[0].name,
      username: result.rows[0].username,
      songs: result.rows.map((row) => ({
        id: row.song_id,
        title: row.song_title,
        performer: row.song_performer,
      })),
    };

    return playlist;
  }
}
 
module.exports = PlaylistsService;