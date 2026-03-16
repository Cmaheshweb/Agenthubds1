function startVoice(){

const recognition=new webkitSpeechRecognition()

recognition.onresult=function(e){

const text=e.results[0][0].transcript

document.getElementById("input").value=text

}

recognition.start()

}