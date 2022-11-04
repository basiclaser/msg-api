// simple express mongoose example
import mongoose from "mongoose"
import express from "express"

const app = express()
app.use(express.json())
const PORT = 8080
const MONGO_URI = "mongodb+srv://dbUser:<password>@cluster0.wxwhw5l.mongodb.net/?retryWrites=true&w=majority"

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
const db = mongoose.connection
db.on("error", (error) => console.error(error))
db.once("open", () => console.log("Connected to Database"))


const messageSchema = new mongoose.Schema({
    groupID: String,
    authorID: String,
    body: String
}, {
    timestamps: true
})
const Message = mongoose.model("Message", messageSchema)
// CRUD 
// Create
app.post("/messages", async (req, res) => {
    console.log(req.body)
    const message = new Message({
        groupID: req.body.groupID,
        authorID: req.body.authorID,
        body: req.body.body
    })
    try {
        const newMessage = await message.save()
        res.status(201).json(newMessage)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

// Read
app.get("/messages", async (req, res) => {
    try {
        const messages = await Message.find()
        res.json(messages)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// Read Messages by Group
app.get("/messages/:groupID", async (req, res) => {
    try {
        const messages = await Message.find({ groupID: req.params.groupID })
        res.json(messages)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// Update
// Delete

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})