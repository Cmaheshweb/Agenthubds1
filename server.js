import express from "express"
import cors from "cors"
import path from "path"
import { fileURLToPath } from "url"

const app = express()

app.use(cors())
app.use(express.json())

// TEST ROUTE
app.post("/chat",(req,res)=>{
console.log("Request:", req.body)

res.json({
reply:"Server working perfectly 🚀"
})
})

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(express.static(__dirname))

app.get("/",(req,res)=>{
res.sendFile(path.join(__dirname,"index.html"))
})

const PORT = process.env.PORT || 5000

app.listen(PORT,"0.0.0.0",()=>{
console.log("Server running on",PORT)
})