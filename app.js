let agent="startup"

function setAgent(a){
agent=a
}

function addMessage(text){

const div=document.createElement("div")

div.innerText=text

document.getElementById("messages").appendChild(div)

}

async function send(){

const input=document.getElementById("input")

const message=input.value

addMessage("You: "+message)

input.value=""

if(agent==="image"){

const res=await fetch("/image",{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({prompt:message})
})

const data=await res.json()

const img=document.createElement("img")

img.src=data.image

img.style.width="300px"

document.getElementById("messages").appendChild(img)

return
}

const res=await fetch("/chat",{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({agent,message})
})

const data=await res.json()

addMessage("AI: "+data.reply)

}