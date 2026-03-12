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

startup:"Generate startup ideas with cost and steps",

study:"Explain study topics simply",

content:"Generate social media posts",

seo:"You are an SEO expert",

youtube:"Give YouTube video ideas",

marketing:"Create marketing strategies",

coding:"Help with coding problems"

}

app.post("/chat",async(req,res)=>{

try{

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

}catch(err){

res.json({
reply:"AI error"
})

}

})

app.post("/image",async(req,res)=>{

try{

const {prompt}=req.body

const result=await openai.images.generate({

model:"gpt-image-1",
prompt:prompt,
size:"1024x1024"

})

res.json({
image:result.data[0].url
})

}catch(err){

res.json({
image:""
})

}

})

app.post("/search",async(req,res)=>{

try{

const {query}=req.body

const completion=await openai.chat.completions.create({

model:"gpt-4.1-mini",

messages:[
{
role:"system",
content:"You are a search engine. Give factual answers."
},
{
role:"user",
content:query
}
]

})

res.json({
answer:completion.choices[0].message.content
})

}catch(err){

res.json({
answer:"Search failed"
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
console.log("AgentHubs running")
})