import express from "express"
import cors from "cors"
import OpenAI from "openai"
import axios from "axios"

const app=express()

app.use(cors())
app.use(express.json())

const openai=new OpenAI({
apiKey:"YOUR_OPENAI_API_KEY"
})

let requestCount={}

const agents={

startup:"Generate startup ideas with cost and steps",

study:"Explain study topics simply",

content:"Generate social media content",

marketing:"Generate marketing plans",

research:"Provide research explanation",

photo:"Give photo editing suggestions",

image:"Generate image prompts"

}

app.post("/chat",async(req,res)=>{

const {message,agent,user}=req.body

if(!requestCount[user]) requestCount[user]=0

if(requestCount[user]>=10){

return res.json({
reply:"Daily limit reached"
})

}

requestCount[user]++

const systemPrompt=agents[agent] || "Helpful AI"

const completion=await openai.chat.completions.create({

model:"gpt-4.1-mini",

messages:[
{role:"system",content:systemPrompt},
{role:"user",content:message}
]

})

res.json({
reply:completion.choices[0].message.content
})

})

app.post("/image",async(req,res)=>{

const {prompt}=req.body

const result=await openai.images.generate({

model:"gpt-image-1",

prompt:prompt,
size:"1024x1024"

})

res.json({
image:result.data[0].url
})

})

app.post("/search",async(req,res)=>{

const query=req.body.query

const result=await axios.get("https://serpapi.com/search.json",{

params:{
q:query,
api_key:"YOUR_SERPAPI_KEY"
}

})

const snippets=result.data.organic_results
.slice(0,3)
.map(r=>r.snippet)
.join("\n")

const completion=await openai.chat.completions.create({

model:"gpt-4.1-mini",

messages:[
{
role:"user",
content:`Answer using this info:\n${snippets}`
}
]

})

res.json({
answer:completion.choices[0].message.content
})

})

app.listen(5000,()=>{
console.log("AgentHubs running")
})