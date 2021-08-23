const socketio = require('socket.io');
const chatModel = require('../config/db').chatModel;

const getTarget = (socketList, userId) => {
  const filtered = socketList.filter(socket => {
    return socket.userInfo.userId === userId;
  });
  if(filtered === []) return null;
  return filtered[0];
};

module.exports = server => {
  const io = socketio(server, {
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST']
    }
  });
  console.log('socket on');
  let socketList = [];

  io.on('connection', (socket) => {
    console.log('connected');
    socket.on('init', (data) => {
      console.log('init socket id', socket.id);
      console.log('init', data);
      const socketInfo = {
        ...socket,
        userInfo: data
      }
      socketList = socketList.concat(socketInfo);
    });

    socket.on('client login', (data) => {
      console.log(data);
    });

    socket.on('disconnect', function() {
      socketList = socketList.filter(item => item !== socket);
      console.log('disconnected');
    });

    socket.on('send msg', (data) => {
      console.log('send msg', data);
      const target = getTarget(socketList, data.toId);
      console.log('target', target.id);
      if(!target) {
        // 상대가 접속 중이 아닐 때
        console.log('target is not found in socket list');
      }
      io.to(target.id).emit('receive msg' , data);
    });
  });
};
