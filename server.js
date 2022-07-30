const express=require("express")
const https = require('https');

const tmi= require('tmi.js')

const app=express()
const puerto=process.env.PORT || 1000






// setInterval(() => {
//   https.get('https://twitchttsbot.herokuapp.com')
// }, 600000);


app.use('/',express.static('principal'))



const server=app.listen(puerto,()=>{
    console.log('Server on port '+puerto)
})

const socketio=require('socket.io')
const io=socketio(server)
io.on('connection',(socket)=>{
    console.log(socket.id)

      
})





const client = new tmi.Client({
    connection: {
      reconnect: true
    },
    channels: [
      'belbio',
      'baitbelaid'
    ]
  });
  
  client.connect();


  client.on('message', async (channel, context, message, user ) => {


    let isStreamer = '#'+context.username.toLowerCase() == channel.toLowerCase()
    console.log(isStreamer)
    
    if(isStreamer || context.mod || context.username.toLowerCase()=='baitbelaid'){
        if(message.startsWith('!stop')){
          console.log('stopping')

          io.sockets.emit('stop')
            
        }
        if(message.startsWith('!ban')){
          userToBan=message.split(' ')[1]
          if(userToBan.startsWith('@')){
            userToBan=userToBan.substring(1)
          }
          io.sockets.emit('ban',{user:userToBan})
        }

        if(message.startsWith('!unban')){
          userToUnban=message.split(' ')[1]

          if(userToUnban.startsWith('@')){
            userToUnban=userToUnban.substring(1)
          }
          io.sockets.emit('unban',{user:userToUnban})
        }
      
      
      }

   console.log(message)
    console.log(context["custom-reward-id"])
      if(context["custom-reward-id"] == "6039ac80-e454-4454-b4f0-5dbba1aaae8b"){
        console.log('es tts')        
          
          io.sockets.emit("tts",{message:message,username:context.username})

        }
      })

