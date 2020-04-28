(this["webpackJsonpreact-sora"]=this["webpackJsonpreact-sora"]||[]).push([[0],{14:function(e,t,n){},25:function(e,t,n){},26:function(e,t,n){"use strict";n.r(t);var a=n(3),o=n(4),i=n(1),s=n(8),c=n(7),l=n(0),r=n.n(l),d=n(5),m=n.n(d);n(14);var h=function(e){var t=Object(l.useRef)(null);return Object(l.useEffect)((function(){var n=e.stream,a=0;e.volume&&(a=e.volume),t.current?(t.current.srcObject===n?console.log("useEffect() same stream, so skip:",n):(t.current.srcObject=n,console.log("useEffect() set stream:",n)),t.current.volume=a):console.log("useEffect() ref.current NULL")})),console.log("Video rendering, id=%s",e.id),e.controls?r.a.createElement("video",{className:"video_with_border",ref:t,id:e.id,width:e.width,height:e.height,autoPlay:!0,muted:!0,playsInline:!0,controls:!0}):r.a.createElement("video",{className:"video_with_border",ref:t,id:e.id,width:e.width,height:e.height,autoPlay:!0,muted:!0,playsInline:!0})},u=n(6),v=n.n(u),g=(n(25),"mm-react-sora-test"),p=function(){var e=window.location.search,t=new RegExp("room=([^&=]+)").exec(e),n="";t&&(n=t[1]);return n}();p&&""!==p&&(g=p);var b="",f=function(){var e=window.location.search,t=new RegExp("key=([^&=]+)").exec(e),n=null;t&&(n=t[1]);return n}();f&&""!==f&&(b=f);var y=v.a.connection("wss://sora-labo.shiguredo.jp/signaling",!1),S=function(e){Object(s.a)(n,e);var t=Object(c.a)(n);function n(e){var o;return Object(a.a)(this,n),(o=t.call(this,e)).localStream=null,o.state={playing:!1,connected:!1,roomId:g,signalingKey:b,videoCodec:"VP9",remoteStreams:{}},o.startVideo=o.startVideo.bind(Object(i.a)(o)),o.stopVideo=o.stopVideo.bind(Object(i.a)(o)),o.connect=o.connect.bind(Object(i.a)(o)),o.disconnect=o.disconnect.bind(Object(i.a)(o)),o.handleRoomChange=o.handleRoomChange.bind(Object(i.a)(o)),o.handleKeyChange=o.handleKeyChange.bind(Object(i.a)(o)),o.handleCodecChange=o.handleCodecChange.bind(Object(i.a)(o)),o.addRemoteStream=o.addRemoteStream.bind(Object(i.a)(o)),o.removeRemoteStream=o.removeRemoteStream.bind(Object(i.a)(o)),o.removeAllRemoteStream=o.removeAllRemoteStream.bind(Object(i.a)(o)),o.publisher=null,o}return Object(o.a)(n,[{key:"componentDidMount",value:function(){console.log("App DidMound()")}},{key:"componentWillUnmount",value:function(){console.log("App WillUnmount()"),this.localStream&&this.stopVideo()}},{key:"startVideo",value:function(e){var t=this;if(e.preventDefault(),console.log("start Video"),this.localStream)console.warn("localVideo ALREADY started");else{navigator.mediaDevices.getUserMedia({video:!0,audio:!0}).then((function(e){t.localStream=e,t.setState({playing:!0})})).catch((function(e){return console.error("media ERROR:",e)}))}}},{key:"stopVideo",value:function(e){e.preventDefault(),console.log("stop Video"),this.localStream&&(this.localStream.getTracks().forEach((function(e){return e.stop()})),this.localStream=null,this.setState({playing:!1}))}},{key:"connect",value:function(e){var t=this;if(e.preventDefault(),console.log("connect"),this.publisher)console.warn("ALREADY connected");else{var n={signaling_key:this.state.signalingKey},a={audio:!0,multistream:!0,video:!0,videoCodecType:this.state.videoCodec,videoBitRate:1e3},o=this;console.log("connecting roomId=%s codec=%s key=%s",this.state.roomId,a.videoCodecType,this.state.signalingKey),this.publisher=y.publisher(this.state.roomId,n,a),this.publisher.on("addstream",(function(e){console.log("addstream id=%s",e.stream.id);var t="remote_"+e.stream.id;o.addRemoteStream(t,e.stream)})),this.publisher.on("removestream",(function(e){console.log("removestream id=%s",e.stream.id);var t="remote_"+e.stream.id;o.removeRemoteStream(t)})),this.publisher.on("disconnect",(function(e){console.log("sora disconnected:",e),t.handleDisconnect()})),this.publisher.connect(this.localStream).then((function(){console.log("sora connected"),o.setState({connected:!0})})).catch((function(e){console.error("sora connect ERROR:",e)}))}}},{key:"disconnect",value:function(e){e.preventDefault(),console.log("disconnect"),this.handleDisconnect()}},{key:"handleDisconnect",value:function(){this.publisher&&(this.publisher.disconnect(),this.publisher=null,this.localStream=null,this.setState({playing:!1})),this.removeAllRemoteStream(),this.setState({connected:!1})}},{key:"handleRoomChange",value:function(e){this.setState({roomId:e.target.value})}},{key:"handleKeyChange",value:function(e){this.setState({signalingKey:e.target.value})}},{key:"handleCodecChange",value:function(e){this.setState({videoCodec:e.target.value})}},{key:"addRemoteStream",value:function(e,t){var n=Object.assign({},this.state.remoteStreams);n[e]=t,this.setState({remoteStreams:n})}},{key:"removeRemoteStream",value:function(e,t){var n=Object.assign({},this.state.remoteStreams);delete n[e],this.setState({remoteStreams:n})}},{key:"removeAllRemoteStream",value:function(){this.setState({remoteStreams:{}})}},{key:"render",value:function(){console.log("App render()");var e=[];return Object.keys(this.state.remoteStreams).forEach((function(t){var n=this[t];console.log("key=id=%s, stream.id=%s",t,n.id),e.push(r.a.createElement(h,{id:t,key:t,width:"320px",height:"240px",volume:.5,controls:!0,stream:n}))}),this.state.remoteStreams),r.a.createElement("div",{className:"App"},"React - Sora Labo example",r.a.createElement("br",null),"Video Codec:",r.a.createElement("select",{value:this.state.videoCodec,onChange:this.handleCodecChange,disabled:this.state.connected},r.a.createElement("option",{value:"VP8"},"VP8"),r.a.createElement("option",{value:"VP9"},"VP9"),r.a.createElement("option",{value:"H264"},"H264"),r.a.createElement("option",{value:"H265"},"H265")),"\xa0",r.a.createElement("button",{onClick:this.startVideo,disabled:this.state.playing||this.state.connected}," Start Video"),r.a.createElement("button",{onClick:this.stopVideo,disabled:!this.state.playing||this.state.connected},"Stop Video"),r.a.createElement("br",null),"SignalingKey: ",r.a.createElement("input",{id:"signaling_key",type:"text",size:"32",value:this.state.signalingKey,onChange:this.handleKeyChange,disabled:this.state.connected}),r.a.createElement("br",null),"Room: ",r.a.createElement("input",{id:"room_id",type:"text",value:this.state.roomId,onChange:this.handleRoomChange,disabled:this.state.connected}),r.a.createElement("button",{onClick:this.connect,disabled:this.state.connected||!this.state.playing}," Connect"),r.a.createElement("button",{onClick:this.disconnect,disabled:!this.state.connected},"Disconnect"),r.a.createElement("br",null),r.a.createElement("div",{className:"VideoContainer"},r.a.createElement(h,{id:"local_video",width:"160px",height:"120px",stream:this.localStream}),r.a.createElement("div",{className:"RemoteContainer"},e)))}}]),n}(r.a.Component);m.a.render(r.a.createElement(S,null),document.getElementById("root"))},9:function(e,t,n){e.exports=n(26)}},[[9,1,2]]]);
//# sourceMappingURL=main.0b5fe270.chunk.js.map