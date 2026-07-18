const express = require("express");

const app = express();
const PORT = 3000;

app.use(express.static("public"));
app.use(express.json());

// AI-এর পরিচয়
let chatHistory = [
    {
        role: "system",
        content: `
তুমি MUNNA AI।

নিয়ম:
- সবসময় বাংলায় উত্তর দেবে (যদি ব্যবহারকারী ইংরেজি না চায়)।
- বন্ধুসুলভভাবে কথা বলবে।
- প্রোগ্রামিং, পড়াশোনা ও সাধারণ প্রশ্নে সাহায্য করবে।
- উত্তর সংক্ষিপ্ত ও পরিষ্কার হবে।
`
    }
];

app.post("/chat", async (req, res) => {
    const message = req.body.message;

    if (!message) {
        return res.json({
            reply: "দয়া করে একটি মেসেজ লিখুন।"
        });
    }

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

        const reply = data.message?.content || "আমি কোনো উত্তর পাইনি।";

        chatHistory.push({
            role: "assistant",
            content: reply
        });

        res.json({
            reply: reply
        });

    } catch (err) {
        console.error(err);

        res.json({
            reply: "❌ Ollama চালু নেই অথবা সংযোগ করা যাচ্ছে না।"
        });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});