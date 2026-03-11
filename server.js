import express from "express"
import cors from "cors"
import OpenAI from "openai"
import path from "path"
import { fileURLToPath } from "url"

const app=express()

app.use(cors())
app.use(express.json())

const openai=new OpenAI({
apiKey:process.env.OPENAI_API_KEY
})

const agents={

startup:"Generate startup ideas",

study:"Explain study topics",

content:"Generate social media content"

}

app.post("/chat",async(req,res)=>{

const {message,agent}=req.body

const prompt=agents[agent] || "Helpful AI"

const completion=await openai.chat.completions.create({

model:"gpt-4.1-mini",

messages:[
{role:"system",content:prompt},
{role:"user",content:message}
]

})

res.json({
reply:completion.choices[0].message.content
})

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