const express = require("express");

const app = express();
const PORT = 3000;

app.use(express.static("public"));
app.use(express.json());

let chatHistory = [];

app.post("/chat", async (req, res) => {
    const message = req.body.message;

    chatHistory.push({
        role: "user",
        content: message
    });

    try {
        const response = await fetch("http://127.0.0.1:11434/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "qwen3:latest",
                messages: chatHistory,
                stream: false
            })
        });

        const data = await response.json();

        console.log(data);

        const reply = data.message?.content || "No response.";

        chatHistory.push({
            role: "assistant",
            content: reply
        });

        res.json({ reply });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            reply: err.message
        });
    }
});

app.listen(PORT, "127.0.0.1", () => {
    console.log(`🚀 Server running on http://127.0.0.1:${PORT}`);
});