const socket=io()

// elements
const messageForm = document.querySelector("#message-form");
const messageForm_Input = messageForm.querySelector("input");
const messageForm_Button = messageForm.querySelector("button");
const messages = document.querySelector("#messages");

// templates
const messageTemplate = document.querySelector("#message-template").innerHTML;
const sidebarTemplate = document.querySelector("#sidebar-template").innerHTML;

// Options
const {username,room}=Qs.parse(location.search,{ignoreQueryPrefix:true});     

// AutoScroll

const autoScroll=()=>{
    // new message element
    const newMessage=messages.lastElementChild
    // height of new Message
    const newMessageStyle=getComputedStyle(newMessage)
    const newMessageMargin=parseInt(newMessageStyle.marginBottom)
    const newMessageHeight=newMessage.offsetHeight+newMessageMargin

    //Visible height
    const visibleHeight=messages.offsetHeight

    // height of messages container
    const containerHeight=messages.scrollHeight

    // how much scroll
    const scrollOffset=messages.scrollTop+visibleHeight

    if(containerHeight-newMessageHeight <=scrollOffset){
        messages.scrollTop=messages.scrollHeight
    }

}

socket.on('message',(message)=>{
    const html=Mustache.render(messageTemplate,{
        message:message.text,
        username:message.username,
        createdAt:moment(message.createdAt).format("h:mm:a")
    })
    messages.insertAdjacentHTML('beforeend',html)
    autoScroll()
})

socket.on('roomData',({room,users,createdAt})=>{
    const html=Mustache.render(sidebarTemplate,{
        room,
        users,
        createdAt:moment(createdAt).format("h:mm:a")

    })
    document.querySelector('#sidebar').innerHTML=html
})

messageForm.addEventListener('submit',(e)=>{
    e.preventDefault()
    messageForm_Button.setAttribute('disabled','disabled')

    // const message=e.target.elements.message.value
    const message=document.querySelector('input').value
    socket.emit('sendMessage',message,(error)=>{
        messageForm_Button.removeAttribute('disabled')
        messageForm_Input.value=""
        messageForm_Input. focus()
        if(error){
            console.log(error)
        }
        console.log('message delevired')
    })

})

socket.emit('join',{username,room},(error)=>{
    if(error){
        alert(error)
        location.href='/'
    }
})