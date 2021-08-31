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
    socket.on('init', (data) => { // client에서 로그인 시 socket list에 추가
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

    // chat
    socket.on('send msg', (data) => {
      console.log('socket list', socketList);
      console.log('send msg', data);
      const target = getTarget(socketList, data.toId);
      if(!target) {
        // 상대가 접속 중이 아닐 때
        console.log('target is not found in socket list');
      } else {
        console.log('target\'s socket id', target.id);
        data.isMe = false;
        io.to(target.id).emit('receive msg' , data);
      }

      data.isMe = true; // 본인에게 전달
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

    // notification
    socket.on('send noti', async (data) => {
      const target = getTarget(socketList, data.toId);
      if(!target) {
        console.log('target is not found in socket list');
      } else {
        console.log('target\'s socket id', target.id);
        io.to(target.id).emit('receive noti');
      }

      // db 저장 
      try {
        const user = await userModel.findOne({ id:  data.fromId });
        user.events = user.events.concat({
          id: data.toId,
          name: data.name,
          img: data.img,
          type: data.type,
          postId: data.postId,
          date: data.date
        });
        await user.save();
      } catch (err) {
        throw err;
      }
    });
  });
};
