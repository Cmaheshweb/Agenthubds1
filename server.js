import express from "express"
import cors from "cors"
import OpenAI from "openai"
import path from "path"
import { fileURLToPath } from "url"

const app = express()

app.use(cors())
app.use(express.json())

const openai = new OpenAI({
apiKey: process.env.OPENAI_API_KEY
})

/* ---------- AGENTS ---------- */

const agents = {

startup: "Generate startup ideas with cost and steps",

study: "Explain study topics in very simple language",

content: "Generate social media posts and captions",

seo: "You are an SEO expert",

youtube: "You help create YouTube video ideas",

marketing: "You create marketing strategies",

coding: "You help with programming"

}

/* ---------- CHAT AGENT ---------- */

app.post("/chat", async (req, res) => {

try{

const { message, agent } = req.body

const prompt = agents[agent] || "Helpful AI assistant"

const completion = await openai.chat.completions.create({

model: "gpt-4.1-mini",

messages: [
{ role: "system", content: prompt },
{ role: "user", content: message }
]

})

res.json({
reply: completion.choices[0].message.content
})

}catch(err){

res.json({
reply: "AI error"
})

}

})

/* ---------- IMAGE GENERATOR ---------- */

app.post("/image", async (req, res) => {

try{

const { prompt } = req.body

const result = await openai.images.generate({

model: "gpt-image-1",

prompt: prompt,
size: "1024x1024"

})

res.json({
image: result.data[0].url
})

}catch(err){

res.json({
image: ""
})

}

})

/* ---------- AI SEARCH ENGINE ---------- */

app.post("/search", async (req, res) => {

try{

const { query } = req.body

const completion = await openai.chat.completions.create({

model: "gpt-4.1-mini",

messages: [
{
role: "system",
content: "You are a search engine. Give factual and clear answers."
},
{
role: "user",
content: query
}
]

})

res.json({
answer: completion.choices[0].message.content
})

}catch(err){

res.json({
answer: "Search failed"
})

}

})

/* ---------- STATIC FILE ---------- */

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(express.static(__dirname))

app.get("/", (req, res) => {
res.sendFile(path.join(__dirname, "index.html"))
})

/* ---------- SERVER ---------- */

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
console.log("AgentHubs Server Running")
})