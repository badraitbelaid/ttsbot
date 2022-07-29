const socket=io()
const audio= document.querySelector('audio')
ttsrequests=[]
socket.on('tts',async(data)=>{
    await speak(data.message,data.username)
})

socket.on('stop',()=>{
    audio.pause()

})

const speak=async (message,username)=>{
    if(audio.paused){
        texto=`${username} dice: ${message}`
        while(texto.length>200){
            texto=texto.slice(0,-1)
          }
        source = `https://translate.google.com/translate_tts?tl=es-JP&q=${encodeURIComponent(texto)}&client=tw-ob`;
        audio.src=source
        audio.play()
        
    }
    else{
        ttsrequests.push({message:message,username:username})

    }

    




}


audio.onpause=()=>{
    if(ttsrequests.length>0){
        speak(ttsrequests[0].message,ttsrequests[0].username)
        ttsrequests.shift()
    }
}
document.querySelector('button').onclick=()=>{
    document.querySelector('button').remove()
    
}


const ping=setInterval(()=>{
    const Http = new XMLHttpRequest();
    const url='https://twitchttsbot.herokuapp.com/';
    Http.open("GET", url);
    Http.send()
    Http.addEventListener("load", ()=>{
        console.log('Se envió el ping al servidor correctamente')
    })
Http.addEventListener("error", (err)=>{
    console.log(err)

})
},60000)



const open = document.getElementById('open');
const modal_container = document.getElementById('modal_container');
const close = document.getElementById('close');



modal_container.classList.add('show');  

close.addEventListener('click', () => {
  modal_container.classList.remove('show');
});

document.onkeydown=(e)=>{
    if(e.code=='Enter'){
        modal_container.classList.remove('show');

    }

}