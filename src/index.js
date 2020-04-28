import React from 'react';
import ReactDOM from 'react-dom';
import Video from './video'; // video.js
import Sora from 'sora-js-sdk';

import './index.css';

// ----
// TODO
//  - video not shown, ref is Null on addstream
//    - maybe useEffect is usefull
// ----

// ------ params -----
const signalingUrl = 'wss://sora-labo.shiguredo.jp/signaling';
let roomId = 'mm-react-sora-test';
const roomFromUrl = getRoomFromUrl();
if (roomFromUrl && (roomFromUrl !== '')) {
  roomId = roomFromUrl;
}
let signalingKey = '';
const keyFromUrl = getKeyFromUrl();
if (keyFromUrl && (keyFromUrl !== '')) {
  signalingKey = keyFromUrl;
}

// ---- URL ----
function getRoomFromUrl() {
  const search = window.location.search;
  const re = new RegExp('room=([^&=]+)');
  const results = re.exec(search);
  let room = '';
  if (results) {
    room = results[1];
  }
  return room;
}

function getKeyFromUrl() {
  const search = window.location.search;
  const re = new RegExp('key=([^&=]+)');
  const results = re.exec(search);
  let key = null;
  if (results) {
    key = results[1];
  }
  return key;
}

// --- Sora -----
const debug = false; //true;
const sora = Sora.connection(signalingUrl, debug);

// ------ App class ------
class App extends React.Component {
  constructor(props) {
    super(props);
    this.localStream = null;
    this.state = {
      playing: false,
      connected: false,
      //gotRemoteStream: false,
      roomId: roomId,
      signalingKey: signalingKey,
      videoCodec: 'VP9',
      remoteStreams: {},
    };

    // This binding is necessary to make `this` work in the callback
    this.startVideo = this.startVideo.bind(this);
    this.stopVideo = this.stopVideo.bind(this);
    this.connect = this.connect.bind(this);
    this.disconnect = this.disconnect.bind(this);
    this.handleRoomChange = this.handleRoomChange.bind(this);
    this.handleKeyChange = this.handleKeyChange.bind(this);
    this.handleCodecChange = this.handleCodecChange.bind(this);
    this.addRemoteStream = this.addRemoteStream.bind(this);
    this.removeRemoteStream = this.removeRemoteStream.bind(this);
    this.removeAllRemoteStream = this.removeAllRemoteStream.bind(this);

    // -- Sora connection --
    this.publisher = null;
    //this.remoteStream1 = null;
  }

  componentDidMount() {
    console.log('App DidMound()');
  }

  componentWillUnmount() {
    console.log('App WillUnmount()');
    if (this.localStream) {
      this.stopVideo();
    }
  }

  // -----------
  startVideo(e) {
    e.preventDefault();
    console.log('start Video');
    if (this.localStream) {
      console.warn('localVideo ALREADY started');
      return;
    }

    const constraints = { video: true, audio: true };
    navigator.mediaDevices.getUserMedia(constraints)
      .then(stream => {
        this.localStream = stream;
        this.setState({ playing: true });
      })
      .catch(err => console.error('media ERROR:', err));
  }

  stopVideo(e) {
    e.preventDefault();
    console.log('stop Video');
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
      this.setState({ playing: false });
    }
  }

  // const metadata = {
  //   signaling_key: "jGTYhHBYhIF0IvzTTvPub0aO8qsmshksqACOCou2GrcOSNTa"
  // };
  // const options = {
  //   multistream: true
  // };
  // const publisher = sora.publisher(channelId, metadata, options);

  // -----------------
  connect(e) {
    e.preventDefault();
    console.log('connect');
    if (this.publisher) {
      console.warn('ALREADY connected');
      return;
    }

    const metadata = {
      signaling_key: this.state.signalingKey
    };
    const options = {
      audio: true,
      multistream: true,
      video: true,
      videoCodecType: this.state.videoCodec,
      videoBitRate: 1000,
    };
    const app = this;
    //console.log('app:', app);

    console.log('connecting roomId=%s codec=%s key=%s', this.state.roomId, options.videoCodecType, this.state.signalingKey);
    this.publisher = sora.publisher(this.state.roomId, metadata, options);
    this.publisher.on('addstream', function (event) {
      console.log('addstream id=%s', event.stream.id);

      // --- test for 1 stream --
      // app.remoteStream1 = event.stream;
      // app.setState({ gotRemoteStream: true });

      // --- for multi stream ---
      const id = 'remote_' + event.stream.id;
      app.addRemoteStream(id, event.stream);

      // var remoteVideo = document.createElement('video');
      // remoteVideo.id = 'publisher-remote-video-' + event.stream.id;
      // remoteVideo.autoplay = true;
      // remoteVideo.srcObject = event.stream;

      // var remoteVideos = document.querySelector('#remote-videos');
      // remoteVideos.appendChild(remoteVideo);
    });

    this.publisher.on('removestream', function (event) {
      console.log('removestream id=%s', event.stream.id);

      // --- test for 1 stream --
      // app.remoteStream1 = null;
      // app.setState({ gotRemoteStream: false });

      // --- for multi stream ---
      const id = 'remote_' + event.stream.id;
      app.removeRemoteStream(id);


      // var remoteVideo = document.querySelector('#publisher-remotevideo-' + event.stream.id);
      // var remoteVideos = document.querySelector('#remote-videos');
      // remoteVideos.removeChild(remoteVideo);
    });

    this.publisher.on('disconnect', e => {
      console.log('sora disconnected:', e);
      this.handleDisconnect()
    });

    this.publisher.connect(this.localStream)
      .then(() => {
        console.log('sora connected');
        app.setState({ connected: true });
      })
      .catch(err => {
        console.error('sora connect ERROR:', err);
      });
  }

  disconnect(e) {
    e.preventDefault();
    console.log('disconnect');
    this.handleDisconnect();
  }

  handleDisconnect() {
    if (this.publisher) {
      this.publisher.disconnect();
      // localStream will be stoped
      this.publisher = null;
      this.localStream = null;
      this.setState({ playing: false });
    }

    this.removeAllRemoteStream();

    //this.remoteStream1 = null;
    //this.setState({ connected: false, gotRemoteStream: false });
    this.setState({ connected: false });
  }

  handleRoomChange(e) {
    this.setState({ roomId: e.target.value });
  }

  handleKeyChange(e) {
    this.setState({ signalingKey: e.target.value });
  }

  handleCodecChange(e) {
    this.setState({ videoCodec: e.target.value });
  }

  addRemoteStream(id, stream) {
    const clonedStreams = Object.assign({}, this.state.remoteStreams);
    clonedStreams[id] = stream;
    this.setState({ remoteStreams: clonedStreams });
  }

  removeRemoteStream(id, stream) {
    const clonedStreams = Object.assign({}, this.state.remoteStreams);
    delete clonedStreams[id];
    this.setState({ remoteStreams: clonedStreams });
  }

  removeAllRemoteStream() {
    const newStreams = {};
    this.setState({ remoteStreams: newStreams });
  }

  // -----------------
  render() {
    console.log('App render()');

    const remoteVideos = [];
    Object.keys(this.state.remoteStreams).forEach(function (key) {
      const stream = this[key]; // this は this.state.remoteStream
      console.log('key=id=%s, stream.id=%s', key, stream.id);
      remoteVideos.push(
        <Video id={key} key={key} width={"320px"} height={"240px"} volume={0.5} controls={true} stream={stream}>
        </Video>
      );
    }, this.state.remoteStreams);

    return (
      <div className="App" >
        React - Sora Labo example<br />
        Video Codec:
        <select value={this.state.videoCodec} onChange={this.handleCodecChange} disabled={this.state.connected} >
          <option value="VP8">VP8</option>
          <option value="VP9">VP9</option>
          <option value="H264">H264</option>
          <option value="H265">H265</option>
        </select>
        &nbsp;
        <button onClick={this.startVideo} disabled={this.state.playing || this.state.connected}> Start Video</button >
        <button onClick={this.stopVideo} disabled={!this.state.playing || this.state.connected}>Stop Video</button>
        <br />
        SignalingKey: <input id="signaling_key" type="text" size="32" value={this.state.signalingKey} onChange={this.handleKeyChange} disabled={this.state.connected}></input>
        <br />
        Room: <input id="room_id" type="text" value={this.state.roomId} onChange={this.handleRoomChange} disabled={this.state.connected}></input>
        <button onClick={this.connect} disabled={this.state.connected || !this.state.playing}> Connect</button >
        <button onClick={this.disconnect} disabled={!this.state.connected}>Disconnect</button>
        <br />
        <div className="VideoContainer">
          <Video id={"local_video"} width={"160px"} height={"120px"} stream={this.localStream}>
          </Video>
          <div className="RemoteContainer">
            {remoteVideos}
            { /*
            <Video id={"remote_video"} width={"320px"} height={"240px"} volume={0.5} controls={true} stream={this.remoteStream1}>
            </Video>
            */ }
          </div>
        </div>
      </div >
    );
  }
}

// ====================== ReactDOM rendering ====================

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
