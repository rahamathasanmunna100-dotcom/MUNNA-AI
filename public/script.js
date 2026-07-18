async function sendMessage() {
    const input = document.getElementById("message");
    const chat = document.getElementById("chat");

    const message = input.value.trim();

    if (message === "") return;

    // User Message
    chat.innerHTML += `
        <p><b>🧑 You:</b> ${message}</p>
    `;

    input.value = "";

    // Typing...
    chat.innerHTML += `
        <p id="typing"><b>🤖 MUNNA AI:</b> Typing...</p>
    `;

    chat.scrollTop = chat.scrollHeight;

    try {

        const response = await fetch("/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: message
            })
        });

        const data = await response.json();

        // Remove Typing
        document.getElementById("typing").remove();

        // AI Reply
        chat.innerHTML += `
            <p><b>🤖 MUNNA AI:</b> ${data.reply}</p>
        `;

    } catch (error) {

        const typing = document.getElementById("typing");
        if (typing) typing.remove();

        chat.innerHTML += `
            <p><b>🤖 MUNNA AI:</b> ❌ Server Error!</p>
        `;
    }

    chat.scrollTop = chat.scrollHeight;
}

// Press Enter to Send
document.getElementById("message").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        sendMessage();
    }
});