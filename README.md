# native webrtc with nodejs and react

## server
server is nodejs.

yarn start server.js

## client
client folder is create-react-app.
yarn run start

### process flow
- client A => server, join room
- client B => server, join room
- client B <= server, other joined
  create new RTCPeerConnection with iceServers descripting stun and turn
  create offer: peer.createOffer() makes offer
  create sdp: peer.setLocalDescription(offer) makes sdp
  send offer to A with payload that have target, caller and sdp
- client B => server, offer  
- client A <= server, offer
  handleReceiveCall
  create new RTCPeerConnection makes peer
  create new RTCSessionDescription(received sdp) makes description
  peer.setRemoteDescription(description) => sdp
  peer.createAnswer()
  peer.setLocalDescription(answer)
  send answer to B with payload that have target, caller and sdp
- client A => server, answer
- client B <= server, answer  
  handleAnswer
  creating new RTCSessionDescription(received sdp) makes desc
  peer.setRemoteDescription(desc)

### reference
https://www.youtube.com/watch?v=JhyY8LdAQHU
https://codelabs.developers.google.com/codelabs/webrtc-web/#0
