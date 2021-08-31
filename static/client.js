var socket = io.connect('/');
let data = new Array();

const msgContainer = document.querySelector('.outermsg');
const message = document.querySelector('.message');
const button = document.querySelector('.btn');
const ul = document.querySelector('#list');

var audio = new Audio("../static/ting.mp3");

// entering name and calling socket to register the name for the client and broadcasting
const user = prompt("Name:");
socket.emit('new-user',user);

socket.on('user-joined-notification',userName=>{
    boxAppend(`${userName} joined the chat`,'alert');
})
socket.on('entry',()=>{
    boxAppend(`Welcome to the Gossip Chat App, feel free to talk anything as 
    data will be erased once you exit :) `,'middle');
    boxAppend(`You joined the chat`,'alert');
})


socket.on('every-online',name=>{
    appendUl(name);
})
socket.on('online',name=>{
    appendUl(name);
})

// adding up the message divs on the basis of pos
const boxAppend = (msg,pos)=>{
    if(msg!=""){
        const msgElement = document.createElement('div');
        msgElement.innerText = msg;
        msgElement.classList.add('msg');
        msgElement.classList.add(pos);
        msgContainer.append(msgElement);
        if(pos=="left"||pos=="alert"){
            audio.play();
        }
    }
}

// appending in ul

const appendUl = (name)=>{
    data = [];
    for(i in name){
    data.push(name[i]); }
    console.log(data);
}

socket.on('receive',item=>{
    boxAppend( `${item.username}
    ${item.message}`,'left');
})

const sendData=()=>{
    let data = message.value;
    socket.emit('send',data);
    boxAppend(`${data}`,'right');
    message.value='';
}

button.addEventListener('click',(e)=>{
    e.preventDefault();
    sendData()
})
message.addEventListener('keydown',(e)=>{
    if(e.keyCode===13){
    e.preventDefault();
    sendData()
}
})

socket.on('left', name =>{
    boxAppend(`${name} left the chat`, 'alert');
})
socket.on('leave', name =>{
    for(i in data){
        if (data[i]===name){
            data.splice(i,1);
        }
    }
    deleteInUl(name);
    console.log(data);
})
function addInUL(){
setInterval(()=>{   
    let len = data.length;
    console.log(len)
    ul.innerHTML="";
    for(i=0;i<len;i++){
        let list = document.createElement('li');
        list.classList.add(data[i]);
        list.innerHTML=`<i class="far fa-user-circle" style="margin-right: 10px;color: #fefe71; margin-bottom: 10px"></i>${data[i]}`;
        ul.appendChild(list);
    }
}, 3000);
}

function deleteInUl(name){
    let del = document.querySelector(`.${name}`);
    del.remove();
}

addInUL();
