import React from 'react';
import './searchbar.css';

class SearchBar extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      searchTerm: '',
      searchTermCookie: ''

    };

    this.search = this.search.bind(this);
    this.searchOnEnterKeyPress = this.searchOnEnterKeyPress.bind(this);
    this.handleTermChange = this.handleTermChange.bind(this);
  }

  search(event){
    document.cookie = 'searchterm=' + this.state.searchTerm ;
    this.props.onSearch(this.state.searchTerm);
  }

  searchOnEnterKeyPress(event){
    if(event.key === 'Enter'){
      document.cookie = 'searchterm=' + this.state.searchTerm;
      this.props.onSearch(this.state.searchTerm);
    };
  }

  handleTermChange(event){
      this.setState({searchTerm: event.target.value});
  }

  componentWillMount(){
    let cookies = decodeURIComponent(document.cookie).match(/searchterm=([^&]*)/);
    if(cookies){
      this.setState({searchTerm: cookies[1]});
    }else{
      this.setState({searchTerm: ''});
    };
  }

  render() {
    return (
      <div className="SearchBar" >
        <input placeholder="Enter A Song, Album, or Artist" onChange={this.handleTermChange} onKeyPress={this.searchOnEnterKeyPress} defaultValue={this.state.searchTerm} autoFocus/>
        <a onClick={this.search}>SEARCH</a>
      </div>
    );
  }
}

export default SearchBar;
