const socket=io()
const audio= document.querySelector('audio')

function arrayRemove(arr, value) { 
    
    return arr.filter(function(ele){ 
        return ele != value; 
    });
}



if(!localStorage.getItem("banned")){
    console.log('no existe')
    localStorage.setItem("banned",JSON.stringify([]))
    console.log(JSON.parse(localStorage.getItem("banned")))
    


}

banned=JSON.parse(localStorage.getItem('banned'))


audio.volume=0.5

const updateList=()=>{
    document.getElementById('lista').innerHTML="<br><li id='valen'>Valentin Luquez</li>"
        for(user of banned){
        document.getElementById('lista').innerHTML+=`<br><li>${user}</li>`
    }
    for(li of document.querySelectorAll('ul li')){
        li.onclick=(e)=>{
                unban(e.target.innerHTML)
            }
                
            
           
        }
        document.getElementById('valen').onclick=()=>{
            alert('No se puede desbanear a valen, no tiene puntos 😭')
        }
    }

    updateList()
ttsrequests=[]
socket.on('tts',async(data)=>{
    await speak(data.message,data.username)
})

socket.on('stop',()=>{
    audio.pause()

})

socket.on('ban',(data)=>{
    console.log(data.user)
    banned=JSON.parse(localStorage.getItem('banned'))
    banned.push(data.user)
    localStorage.setItem('banned',JSON.stringify(banned))
    updateList()
})





const unban=(user)=>{
    console.log("unbanning "+user)
    banned=JSON.parse(localStorage.getItem('banned'))
    if(banned.includes(user)){
        console.log("user is banned")
        banned=arrayRemove(banned,user)
        localStorage.setItem('banned',JSON.stringify(banned))

        updateList()
    }
}


socket.on('unban',(data)=>{
    unban(data.user)

})

const speak=async (message,username)=>{
    if(!banned.includes(username)){
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

    else{
        console.log('User is banned, he cant use tts')
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
  document.querySelector("#modal_container").remove()

});

document.onkeydown=(e)=>{
    if(e.code=='Enter'){
        modal_container.classList.remove('show');
        document.querySelector("#modal_container").remove()

    }

}



const rangeInputs = document.querySelectorAll('input[type="range"]')

function handleInputChange(e) {
  let target = e.target
  if (e.target.type !== 'range') {
    target = document.getElementById('range')
  } 
  const min = target.min
  const max = target.max
  const val = target.value
  
  audio.volume=val/100
  target.style.backgroundSize = (val - min) * 100 / (max - min) + '% 100%'
}

rangeInputs.forEach(input => {
  input.addEventListener('input', handleInputChange)
})

