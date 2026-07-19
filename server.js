const express = require("express");
const Groq = require("groq-sdk");

const app = express();

const PORT = process.env.PORT || 3000;

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

app.use(express.static("public"));
app.use(express.json());

let chatHistory = [];

app.post("/chat", async (req, res) => {
  try {
    const message = req.body.message;

    chatHistory.push({
      role: "user",
      content: message,
    });

    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",
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
    console.error(err);
    res.status(500).json({
      reply: err.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});