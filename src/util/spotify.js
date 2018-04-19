const clientId = 'a86892b24ec945b3b01f0575564143aa';
const redirectURI = 'http://localhost:3000/';
//const redirectURI = 'http://createajammmingplaylisttest.surge.sh';

let accessToken = '';
let expirationTime = 0;
let userId = '';
let listOfURIs = [];
let playlistName = '';
let playlistId = '';
let snapshotId = '';


const Spotify = {

  getAccessToken(){
    if(accessToken){
      document.cookie = 'searchterm=' + '';
      return accessToken;
    }else{

      if(window.location.href.match(/access_token=([^&]*)/)){
        accessToken = window.location.href.match(/access_token=([^&]*)/)[1];
        expirationTime = window.location.href.match(/expires_in=([^&]*)/)[1];

        window.setTimeout(() => accessToken = '', expirationTime * 1000);
        window.history.pushState('Access Token', null, '/');

        document.cookie = 'searchterm=' + '';

        return new Promise((resolve, reject) => {
          resolve(accessToken);
        });
      }else{
        window.location = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}&show_dialog=false&scope=playlist-modify-private`;
      };

    };
  }, // close getAccessToken

  search(searchTerm){
    if(accessToken){
      return fetch(`https://api.spotify.com/v1/search?type=track&q=${searchTerm}`, {
          headers: {Authorization: `Bearer ${accessToken}`}
        }).then(response => {
          return response.json();
        }).then(jsonResponse => {
            if(jsonResponse.tracks.items){
              return jsonResponse.tracks.items.map(track => (
                {
                  id: track.id,
                  name: track.name,
                  artist: track.artists[0].name,
                  album: track.album.name,
                  uri: track.uri,
                  inPlaylist: false
                }
              ));
            }else{
              return []
            }
          }); //close jsonResponse
      }else{
        window.location = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}&show_dialog=true&scope=playlist-modify-private`;
      };
  }, //close search

  getUserId(myPlaylistName, myListOfURIs) {
    playlistName = myPlaylistName;
    listOfURIs = myListOfURIs;

    if(playlistName && listOfURIs){
      //First grab the User ID
      return fetch('https://api.spotify.com/v1/me', {
          headers: {Authorization: `Bearer ${accessToken}`},
        }).then(response => {
          if(response.ok) {
            return response.json();
          }
          throw new Error('Request failed');
        }, networkError => console.log(networkError.message)
      ).then(jsonResponse => {
        if(jsonResponse.id){
            return new Promise((resolve, reject) => {
              userId = jsonResponse.id;
              resolve(userId);
            });
          }; // closes jsonResponse.id
        }); // closes .then(jsonResponse =>
      }; //closes if
    }, //closes getUserId


  //Now create the Playlist
  savePlaylist(myUserId){
    return fetch(`https://api.spotify.com/v1/users/${myUserId}/playlists`, {
      method: 'POST',
      body: JSON.stringify({name: playlistName, description: 'A playlist created with Jammming'}),
      headers: {Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json'},
    }).then(response => {
      if (response.ok){
        return response.json();
      }
        throw new Error('Request failed');
      }, networkError => console.log(networkError.message)
      ).then(jsonResponse => {
        if(jsonResponse.id){
            return new Promise((resolve, reject) => {
              playlistId = jsonResponse.id;
              resolve(playlistId);
            });
        }; //closes jsonResonse.id
      }); //closes .then(jsonResponse =>
    },

  //Now send the Tracks to the Playlist
  sendTracksToPlaylist(playlistId){
    fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`, {
      method: 'POST',
      body: JSON.stringify({uris: listOfURIs}),
      headers: {Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json'},
    }).then(response => {
      if (response.ok){
        return response.json();
      }
      throw new Error('Request failed');
      }, networkError => console.log(networkError.message)
      ).then(jsonResponse => {
        if(jsonResponse){
          if(jsonResponse.id){
            return new Promise((resolve, reject) => {
              snapshotId = jsonResponse.snapshot_id;
              resolve(snapshotId);
            });
          };
        };
      }); // closes Track Fetch
    }

}

export default Spotify;
