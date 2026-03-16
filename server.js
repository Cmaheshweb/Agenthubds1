const express = require("express")
const cors = require("cors")
const axios = require("axios")
const multer = require("multer")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static(__dirname))

const upload = multer({ dest: "uploads/" })

const AI_KEY = process.env.GEMINI_API_KEY

async function askAI(prompt){

const res = await axios.post(
`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${AI_KEY}`,
{
contents:[
{
parts:[{text:prompt}]
}
]
}
)

return res.data.candidates[0].content.parts[0].text
}

let users = []
let chats = []

// CHAT
app.post("/chat", async(req,res)=>{

const {agent,message}=req.body

let prompt=""

if(agent==="startup")
prompt=`Give startup idea: ${message}`

if(agent==="study")
prompt=`Explain simply: ${message}`

if(agent==="content")
prompt=`Create social media post: ${message}`

if(agent==="coding")
prompt=`Help with programming: ${message}`

if(agent==="marketing")
prompt=`Create marketing strategy: ${message}`

const reply = await askAI(prompt)

res.json({reply})

})

// MULTI AGENT

app.post("/multi-agent", async(req,res)=>{

const {message}=req.body

const startup = await askAI(`Startup analysis: ${message}`)
const research = await askAI(`Research insights: ${message}`)
const marketing = await askAI(`Marketing strategy: ${message}`)

res.json({startup,research,marketing})

})

// IMAGE

app.post("/image",(req,res)=>{

const {prompt}=req.body

const url=`https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`

res.json({image:url})

})

// SEARCH

app.post("/search",async(req,res)=>{

const {query}=req.body

const answer=await askAI(`Answer like search engine: ${query}`)

res.json({answer})

})

// BUSINESS PLAN

app.post("/business-plan",async(req,res)=>{

const {idea,market}=req.body

const plan=await askAI(`
Create business plan
Idea: ${idea}
Market: ${market}
Include:
revenue model
startup cost
customer acquisition
`)

res.json({plan})

})

// CODE GENERATOR

app.post("/code-generator",async(req,res)=>{

const {request}=req.body

const code=await askAI(`Generate code:\n${request}`)

res.json({code})

})

// FILE ANALYZER

app.post("/file-analyze",upload.single("file"),async(req,res)=>{

const text="File uploaded. Summarize and analyze content."

const result=await askAI(text)

res.json({result})

})

// REGISTER

app.post("/register",async(req,res)=>{

const {email,password}=req.body

const hash=await bcrypt.hash(password,10)

users.push({email,password:hash})

res.json({message:"registered"})

})

// LOGIN

app.post("/login",async(req,res)=>{

const {email,password}=req.body

const user=users.find(u=>u.email===email)

if(!user) return res.json({error:"User not found"})

const valid=await bcrypt.compare(password,user.password)

if(!valid) return res.json({error:"Invalid password"})

const token=jwt.sign({email}, "secret")

res.json({token})

})

const PORT = process.env.PORT || 5000

app.listen(PORT,"0.0.0.0",()=>{

console.log("AgentHubs running on",PORT)

})