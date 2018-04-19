import React from 'react';
import './playlist.css';
import Tracklist from '../tracklist/tracklist';
import SaveButton from '../savebutton/savebutton';

class Playlist extends React.Component {
  constructor(props){
    super(props);

    this.handleNameChange = this.handleNameChange.bind(this);
  }

  handleNameChange(event){
    this.props.onNameChange(event.target.value);
  }


  render() {
    return (
      <div className="Playlist">
        <input placeholder='Enter A Playlist Name' onChange={this.handleNameChange} autoComplete='off' value={this.props.playlistName}/>
        <Tracklist tracks={this.props.playlistTracks} onRemove={this.props.onRemove} isRemoval={true}/>
        <SaveButton className={this.props.saveButtonClass} onSave={this.props.onSave} tracks={this.props.playlistTracks} name={this.props.playlistName}/>
      </div>
    );
  }
}

export default Playlist;
