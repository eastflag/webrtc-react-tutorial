const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const rooms = {};

io.on("connection", socket => {
  socket.on("join room", roomID => {
    console.log('roomID: ', roomID, rooms);

    if (rooms[roomID]) {
      rooms[roomID].push(socket.id);
    } else {
      rooms[roomID] = [socket.id];
    }
    const otherUser = rooms[roomID].find(id => id !== socket.id);
    console.log('otherUser: ', otherUser)
    if (otherUser) {
      socket.emit("other user", otherUser);
      socket.to(otherUser).emit("user joined", socket.id);
    }
  });

  socket.on("offer", payload => {
    io.to(payload.target).emit("offer", payload);
  });

  socket.on("answer", payload => {
    io.to(payload.target).emit("answer", payload);
  });

  socket.on("ice-candidate", incoming => {
    io.to(incoming.target).emit("ice-candidate", incoming.candidate);
  });

  socket.on("disconnect", () => {
    for(let key in rooms) {
      const index = rooms[key].findIndex(roomId => roomId === socket.id);
      if (index > -1) {
        rooms[key].splice(index, 1);
      }
    }
    console.log('disconnect: ', rooms);
  })
});

server.listen(8000, () => {
  console.log('server start');
})
