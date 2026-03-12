import express from "express"
import cors from "cors"
import OpenAI from "openai"
import path from "path"
import { fileURLToPath } from "url"

const app=express()

app.use(cors())
app.use(express.json())

app.get("/key",(req,res)=>{

if(process.env.OPENAI_API_KEY){
res.send("API KEY FOUND")
}else{
res.send("API KEY MISSING")
}

})

const agents={

startup:"Give startup ideas",

study:"Explain study topic simply",

content:"Create social media post"

}

app.post("/chat",async(req,res)=>{

try{

const {message,agent}=req.body

console.log("Message:",message)

const prompt=agents[agent] || "Helpful assistant"

const completion=await openai.chat.completions.create({

model:"gpt-4o-mini",

messages:[
{role:"system",content:prompt},
{role:"user",content:message}
]

})

res.json({
reply:completion.choices[0].message.content
})

}catch(err){

console.log(err)

res.json({
reply:"AI error"
})

}

})

const __filename=fileURLToPath(import.meta.url)
const __dirname=path.dirname(__filename)

app.use(express.static(__dirname))

app.get("/",(req,res)=>{
res.sendFile(path.join(__dirname,"index.html"))
})

const PORT=process.env.PORT || 5000

app.listen(PORT,()=>{
console.log("Server running")
})