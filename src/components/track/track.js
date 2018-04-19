import React from 'react';
import './track.css';

class Track extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      trackClass: "Track-action"
    };

    this.renderAction = this.renderAction.bind(this);
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.addOrRemoveTrack = this.addOrRemoveTrack.bind(this);
  }

  renderAction(){
    if(this.props.isRemoval){
      return '-';
    }else{
      if(this.props.track.inPlaylist){
        return "\u2713"
      }else{
      return '+';
      };
    };
  }

  addTrack(event){
    this.props.onAdd(this.props.track);
    this.setState({trackClass: "Track-action-exists"});
    console.log(this.state.trackClass);
    event.preventDefault();
  }

  removeTrack(event){
    this.props.onRemove(this.props.track);
    this.setState({trackClass: "Track-action"});
    console.log(this.state.trackClass);
    event.preventDefault();
  }

  addOrRemoveTrack(event){
      if(this.props.isRemoval){
        this.removeTrack(event);
      }else{
        this.addTrack(event);
      };
  }

  render() {
    return (
      <div className="Track">
        <div className="Track-information">
          <h3>{this.props.track.name}</h3>
          <p>{this.props.track.artist} | {this.props.track.album}</p>
        </div>
        <a className={this.state.trackClass} onClick={this.addOrRemoveTrack}>{this.renderAction()}</a>
      </div>
    );
  }
}

export default Track;
