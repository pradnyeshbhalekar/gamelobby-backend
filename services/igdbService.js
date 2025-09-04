const axios = require('axios');

let accessToken
let tokenExpiry = 0;

async function getAccessToken() {
  const now = Date.now();
  if (accessToken && now < tokenExpiry) {
    return accessToken;
  }

  const res = await axios.post('https://id.twitch.tv/oauth2/token', null, {
    params: {
      client_id: process.env.TWITCH_CLIENT_ID,
      client_secret: process.env.TWITCH_CLIENT_SECRET,
      grant_type: "client_credentials"
    }
  });

  accessToken = res.data.access_token;
  tokenExpiry = now + res.data.expires_in * 1000; // convert to ms

  return accessToken;
}


async function fetchGameFromIGDB(searchTerm) {
  try {
    const token = await getAccessToken();

    const response = await axios.post(
      'https://api.igdb.com/v4/games',
      `search "${searchTerm}"; fields id,name,genres.name,first_release_date,cover.url; limit 10;`,
      {
        headers: {
          'Client-ID': process.env.TWITCH_CLIENT_ID,
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data; 
  } catch (err) {
    console.error('IGDB fetch error:', err.response?.data || err.message);
    return [];
  }
}

async function fetchGameByID(id) {
  try {
    const token = await getAccessToken();

    const response = await axios.post(
    'https://api.igdb.com/v4/games',
    `where id = ${id}; 
    fields id, name, genres.name, first_release_date, cover.url, multiplayer_modes.*, platforms.name, summary;`,
  {
    headers: {
      Authorization: `Bearer ${token}`,
      'Client-ID': process.env.TWITCH_CLIENT_ID,
    },
  }
);


    return response.data[0] || null;
  } catch (err) {
    console.error("error occurred in fetchGameByID:", err.response?.data || err.message);
    return null;
  }
}



module.exports = { getAccessToken, fetchGameFromIGDB,fetchGameByID };
