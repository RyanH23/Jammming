import React from 'react';
import './savebutton.css';

class SaveButton extends React.Component {
  constructor(props){
    super(props);

    this.state = {
        warning: 'Warning-Closed',
        playlistNameWarning: 'Show-Name-Warning',
        tracklistWarning: 'Show-Tracks-Warning'
    }

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event){
    if(this.props.tracks.length && this.props.name){
      this.setState({warning: 'Warning-Closed', noPlaylistName: 'Hidden', noPlaylistTracks: 'Hidden'});
      this.props.onSave();
    }else if(this.props.tracks.length || this.props.name){
      if(this.props.tracks.length){
        //this.setState({warning: 'Warning-Open1', noPlaylistName: 'No-Playlist-Name'});
        this.setState({warning: 'Warning-Open1'});
        this.setState({tracklistWarning: 'Hidden'});
      }else{
        //this.setState({warning: 'Warning-Open1', noPlaylistTracks: 'No-Playlist-Tracks'});
        this.setState({warning: 'Warning-Open1'});
        this.setState({playlistNameWarning: 'Hidden'});        
      };
    }else{
      //this.setState({noPlaylistTracks: 'No-Playlist-Tracks', noPlaylistName: 'No-Playlist-Name'});
      this.setState({warning: 'Warning-Open2'});
      this.setState({playlistNameWarning: 'Show-Name-Warning'});
      this.setState({tracklistWarning: 'Show-Tracks-Warning'});
      };

  }


  render() {
    return (
      <div className='Button-Wrapper'>
        <a className={this.props.className} onClick={this.handleClick}>SAVE TO SPOTIFY</a>
        <div className={this.state.warning}>
          <p className={this.state.playlistNameWarning}>-Add a playlist name before saving</p>
          <p className={this.state.tracklistWarning}>-Add some tracks before saving</p>
        </div>
      </div>
    );
  }
}

export default SaveButton;
