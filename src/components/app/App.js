import React from 'react';
import Spotify from '../../util/spotify';
import './App.css';
import SearchBar from '../searchbar/searchbar';
import SearchResults from '../searchresults/searchresults';
import Playlist from '../playlist/playlist';


class App extends React.Component {
  constructor(props){
      super(props);
      this.state = {
        searchResults: [],
        playlistName: '',
        playlistTracks: [],
        saveButtonClass: "Playlist-save-unactive",
      };
      this.addTrack = this.addTrack.bind(this);
      this.removeTrack = this.removeTrack.bind(this);
      this.updatePlaylistName = this.updatePlaylistName.bind(this);
      this.savePlaylist = this.savePlaylist.bind(this);
      this.search = this.search.bind(this);
  }


  addTrack(track){
    const playlistTracksLength = this.state.playlistTracks.length;
    let playlistTrackCounter = 0;

    this.state.playlistTracks.forEach(pTrack => {
      if(pTrack.id !== track.id){
        playlistTrackCounter++;
      };
    }); // end of forEach

    if(playlistTrackCounter === playlistTracksLength){
      const newPlaylist = this.state.playlistTracks;
      newPlaylist.push(track);
      this.setState({playlistTracks: newPlaylist});
      track.inPlaylist = true;
    }else{
      //alert('This song is already in the playlist');
    };

    if(this.state.playlistName && this.state.playlistTracks.length){
      this.setState({saveButtonClass: "Playlist-save"});
    }else{
      this.setState({saveButtonClass: "Playlist-save-unactive"});
    };
  } //end of addTrack


  removeTrack(track){
    let playlistTrackIndex = 0;
    let foundIndex = false;

    this.state.playlistTracks.forEach(pTrack => {
      if(pTrack.id !== track.id){
        if(!foundIndex){
          playlistTrackIndex++;
        };
      }else{
        foundIndex = true;
      };
    }); // end of forEach

    if(foundIndex){
      const newPlaylist = this.state.playlistTracks;
      newPlaylist.splice(playlistTrackIndex, 1);
      this.setState({playlistTracks: newPlaylist});
      track.inPlaylist = false;
    };

    if(this.state.playlistName && this.state.playlistTracks.length){
      this.setState({saveButtonClass: "Playlist-save"});
    }else{
      this.setState({saveButtonClass: "Playlist-save-unactive"});
    };
  } //end of removeTrack


  updatePlaylistName(name){
      return new Promise((resolve, reject) => {
        this.setState({playlistName: name});
        resolve(name);
      }).then(name => {
      this.setSaveButtonStatus(name, this.state.playlistTracks.length);
    });
  };


  setSaveButtonStatus(thePlaylistName, thePlaylistTracks){
    if(thePlaylistName && thePlaylistTracks){
      this.setState({saveButtonClass: "Playlist-save"});
    }else{
      this.setState({saveButtonClass: "Playlist-save-unactive"});
    };
  }


  search(term){
    Spotify.getAccessToken();
    Spotify.search(term).then(tracks => {
      this.setState({searchResults: tracks});
    });
  } //close of search


  savePlaylist(){
    let listOfURIs = [];
    this.state.playlistTracks.map(track => {
       listOfURIs.push(track.uri);
    });

    if(this.state.saveButtonClass === "Playlist-save"){
      Spotify.getUserId(this.state.playlistName, listOfURIs).then(userId => {
        Spotify.savePlaylist(userId).then(playlistId => {
          Spotify.sendTracksToPlaylist(playlistId);
        });
      }
    );
    this.resetTracksInPlaylist(this.state.playlistTracks);
    this.setState({playlistTracks: []});
    this.updatePlaylistName('');
    this.setState({saveButtonClass: "Playlist-save-unactive"});
  }else{
  //  alert('You need a playlist name and at least 1 track to save the playlist')
  };


  } //close of savePlaylist


  resetTracksInPlaylist(playlistTracks){
    playlistTracks.forEach(track =>{
      track.inPlaylist = false;
    });
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search}/>
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack}/>
            <Playlist playlistName={this.state.playlistName} onNameChange={this.updatePlaylistName} onSave={this.savePlaylist} playlistTracks={this.state.playlistTracks} onRemove={this.removeTrack} saveButtonClass={this.state.saveButtonClass}/>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
