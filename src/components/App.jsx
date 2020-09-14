import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // load = (url) => {
  //   this.setState({
  //     url,
  //     played: 0,
  //     loaded: 0,
  //     pip: false,
  //   });
  // }

  // handlePlayPause = () => {
  //   const { playing } = this.state;
  //   this.setState({ playing: !playing });
  // }

  // handleMuteAction = () => {
  //   const { muted } = this.state;
  //   this.setState({ muted: !muted });
  // }

  // handleNextTrackAction = () => {
  //   const { currentTrackNumber, tracks } = this.state;
  //   if (currentTrackNumber === (tracks.length - 1)) {
  //     this.setState({ currentTrackNumber: 0 });
  //   } else {
  //     this.setState({ currentTrackNumber: currentTrackNumber + 1 });
  //   }
  // }

  // handlePrevTrackAction = () => {
  //   const { currentTrackNumber, tracks } = this.state;
  //   if (currentTrackNumber === 0) {
  //     this.setState({ currentTrackNumber: tracks.length - 1 });
  //   } else {
  //     this.setState({ currentTrackNumber: currentTrackNumber - 1 });
  //   }
  // }

  // handleDuration = (duration) => {
  //   this.setState({ duration });
  // }

  // handleVolumeChange = (e) => {
  //   const { muted } = this.state;
  //   const volume = parseFloat(e.target.value);
  //   this.setState({ volume });
  //   if (volume === 0) {
  //     this.setState({ muted: true });
  //   }
  //   if (volume !== 0 && muted !== false) {
  //     this.setState({ muted: false });
  //   }
  // }

  // handleSeekChange = (e) => {
  //   this.setState({ played: parseFloat(e.target.value) });
  // }

  // handleSeekMouseDown = () => {
  //   this.setState({ seeking: true });
  // }

  // handleSeekMouseUp = (player) => (e) => {
  //   this.setState({ seeking: false });
  //   player.seekTo(parseFloat(e.target.value));
  // }

  // handleProgress = (state) => {
  //   if (!this.state.seeking) {
  //     this.setState(state);
  //   }
  // }

  // handleTrackSelect = (id) => () => {
  //   this.setState({ currentTrackNumber: id });
  // }

  // handleOnEnded = () => {
  //   const { currentTrackNumber, tracks } = this.state;
  //   if (currentTrackNumber === (tracks.length - 1)) {
  //     this.setState({ currentTrackNumber: 0 });
  //   } else {
  //     this.setState({ currentTrackNumber: currentTrackNumber + 1 });
  //   }
  // }

  // handleRepeateAction = () => {
  //   const { loop } = this.state;
  //   this.setState({ loop: !loop });
  // }

  // handleonMouseEnter = () => {
  //   this.setState({ volumeRangeShown: true });
  // }

  // handleonMouseLeave = () => {
  //   this.setState({ volumeRangeShown: false });
  // }

  // handleChange = (e) => {
  //   const { name, value } = e.target;
  //   const { form } = this.state;
  //   this.setState({ form: { ...form, [name]: value } });
  // }

  render() {
    return (
      <form>
        {/* <div className="form-group">
          <input type="text" className="form-control" name="name" onChange={this.handleChange} />
        </div> */}
        <button type="submit" className="btn btn-primary btn-block" width="100%">Send</button>
      </form>
    );
  }
}
