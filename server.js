import express from "express"
import cors from "cors"
import path from "path"
import { fileURLToPath } from "url"
import { GoogleGenerativeAI } from "@google/generative-ai"

const app=express()

app.use(cors())
app.use(express.json())

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

const model = genAI.getGenerativeModel({
model:"gemini-1.5-flash"
})

const agents={
startup:"Give startup idea",
study:"Explain study topic simply",
content:"Create social media caption"
}

app.post("/chat",async(req,res)=>{

try{

const {message,agent}=req.body

const prompt=(agents[agent] || "Helpful assistant") + "\n\nUser: "+message

const result = await model.generateContent(prompt)

const text = result.response.text()

res.json({
reply:text
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

const PORT = process.env.PORT || 5000

app.listen(PORT,"0.0.0.0",()=>{
console.log("AgentHubs running")
})