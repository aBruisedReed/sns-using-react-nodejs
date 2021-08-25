const socketio = require('socket.io');
const userModel = require('../config/db').userModel;

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
      console.log('init socket', socket.id, data);
      const socketInfo = {
        ...socket,
        userInfo: data
      }
      socketList = socketList.concat(socketInfo);
    });

    socket.on('disconnect', function() {
      socketList = socketList.filter(item => item !== socket);
      console.log('disconnected');
    });

    socket.on('send msg', (data) => {
      console.log('socket list', socketList);
      console.log('send msg', data);
      const target = getTarget(socketList, data.toId);
      if(!target) {
        // 상대가 접속 중이 아닐 때
        console.log('target is not found in socket list');
      } else {
        console.log('target', target.id);
        data.isMe = false;
        io.to(target.id).emit('receive msg' , data);
      }
      data.isMe = true;
      io.to(socket.id).emit('receive msg' , data);

      // db 저장 
      userModel.findOne({ id: data.fromId }, (err, user) => {
        if(err) { throw err; }
        else {
          const foundIdx = user.chats.findIndex((chat) => {
            if(chat.targetId === data.toId) return true;
            else return false;
          });
          if(foundIdx === -1) {
            user.chats = user.chats.concat({
              targetId: data.toId,
              msgs: [{
                content: data.msg,
                date: new Date()
              }]
            });
          } else {
            user.chats[foundIdx].msgs = user.chats[foundIdx].msgs.concat({
              content: data.msg,
              date: new Date()
            })
          }
          user.save((err) => {
            if(err) throw err;
          })
        }
      });
    });
  });
};
