import express from "express"
import cors from "cors"
import OpenAI from "openai"
import path from "path"
import { fileURLToPath } from "url"

const app = express()

app.use(cors())
app.use(express.json())

// ---- OpenAI Setup ----
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

// ---- Agents ----
const agents = {
  startup: "Give a startup idea with cost and steps.",
  study: "Explain the topic simply for students.",
  content: "Create social media post or caption.",
  seo: "Give SEO strategy.",
  youtube: "Suggest YouTube video ideas.",
  marketing: "Create marketing strategy.",
  coding: "Help with coding."
}

// ---- Chat API ----
app.post("/chat", async (req, res) => {

  try {

    const { message, agent } = req.body

    const systemPrompt = agents[agent] || "Helpful AI assistant."

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ]
    })

    res.json({
      reply: completion.choices[0].message.content
    })

  } catch (error) {

    console.log("CHAT ERROR:", error)

    res.json({
      reply: "AI server error. Check API key."
    })

  }

})


// ---- Image Generator ----
app.post("/image", async (req, res) => {

  try {

    const { prompt } = req.body

    const result = await openai.images.generate({
      model: "gpt-image-1",
      prompt: prompt,
      size: "1024x1024"
    })

    res.json({
      image: result.data[0].url
    })

  } catch (error) {

    console.log("IMAGE ERROR:", error)

    res.json({
      image: ""
    })

  }

})


// ---- Search Engine ----
app.post("/search", async (req, res) => {

  try {

    const { query } = req.body

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a search engine. Give factual answers." },
        { role: "user", content: query }
      ]
    })

    res.json({
      answer: completion.choices[0].message.content
    })

  } catch (error) {

    console.log("SEARCH ERROR:", error)

    res.json({
      answer: "Search failed."
    })

  }

})


// ---- Static Frontend ----
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(express.static(__dirname))

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"))
})


// ---- Server ----
const PORT = process.env.PORT || 5000

app.listen(PORT, () => {

  if (!process.env.OPENAI_API_KEY) {
    console.log("⚠️ OPENAI_API_KEY NOT SET")
  }

  console.log("🚀 AgentHubs Server Running")

})