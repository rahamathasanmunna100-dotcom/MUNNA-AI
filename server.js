const express = require("express");
const Groq = require("groq-sdk");

const app = express();
const PORT = process.env.PORT || 10000;

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

app.use(express.static("public"));
app.use(express.json());

let chatHistory = [];

app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        reply: "Message is required.",
      });
    }

    chatHistory.push({
      role: "user",
      content: message,
    });

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: chatHistory,
    });

    const reply =
      completion.choices[0]?.message?.content || "No response.";

    chatHistory.push({
      role: "assistant",
      content: reply,
    });

    res.json({ reply });

  } catch (err) {
    console.error("FULL ERROR:", err);

    res.status(500).json({
      reply: err.message || "Server Error",
    });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});