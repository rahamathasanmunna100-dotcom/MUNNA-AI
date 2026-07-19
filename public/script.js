const input = document.getElementById("message");
const chat = document.getElementById("chat");
const themeBtn = document.getElementById("themeBtn");

// =====================
// Load Chat History
// =====================
window.onload = () => {
    const history = localStorage.getItem("munna_chat");

    if (history) {
        chat.innerHTML = history;
        chat.scrollTop = chat.scrollHeight;
    }
};

// =====================
// Theme
// =====================
themeBtn.onclick = () => {

    document.body.classList.toggle("light");

    themeBtn.innerHTML =
        document.body.classList.contains("light")
        ? "☀️"
        : "🌙";
};

// =====================
// Send Message
// =====================
async function sendMessage() {

    const message = input.value.trim();

    if (!message) return;

    addUserMessage(message);

    input.value = "";

    showTyping();

    try {

        const response = await fetch("/chat", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                message
            })

        });

        const data = await response.json();

        removeTyping();

        addAIMessage(data.reply);

        saveChat();

        speak(data.reply);

    } catch (err) {

        removeTyping();

        addAIMessage("❌ Server Error");

        console.error(err);

    }

}

// =====================
// User Message
// =====================
function addUserMessage(text){

    chat.innerHTML += `
    <div class="message user">
        ${text}
    </div>
    `;

    chat.scrollTop = chat.scrollHeight;

}

// =====================
// AI Message
// =====================
function addAIMessage(text){

    chat.innerHTML += `
    <div class="message ai">
        ${text}
    </div>
    `;

    chat.scrollTop = chat.scrollHeight;

}

// =====================
// Typing
// =====================
function showTyping(){

    chat.innerHTML += `
    <div class="message ai" id="typing">
        ⏳ MUNNA AI is typing...
    </div>
    `;

    chat.scrollTop = chat.scrollHeight;

}

function removeTyping(){

    const typing = document.getElementById("typing");

    if(typing){

        typing.remove();

    }

}

// =====================
// Save Chat
// =====================
function saveChat(){

    localStorage.setItem(
        "munna_chat",
        chat.innerHTML
    );

}

// =====================
// Voice Reply
// =====================
function speak(text){

    speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(text);

    speech.lang = "en-US";

    speech.rate = 1;

    speech.pitch = 1;

    speechSynthesis.speak(speech);

}

// =====================
// Voice Input
// =====================
function startVoice(){

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;

    if(!SpeechRecognition){

        alert("Voice Not Supported");

        return;

    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";

    recognition.start();

    recognition.onresult = (event)=>{

        input.value =
            event.results[0][0].transcript;

        sendMessage();

    };

}

// =====================
// Image Upload
// =====================
document.getElementById("imageFile")
.addEventListener("change",(e)=>{

    const file = e.target.files[0];

    if(!file) return;

    addUserMessage("🖼️ Image: " + file.name);

});

// =====================
// PDF Upload
// =====================
document.getElementById("pdfFile")
.addEventListener("change",(e)=>{

    const file = e.target.files[0];

    if(!file) return;

    addUserMessage("📄 PDF: " + file.name);

});

// =====================
// Enter Key
// =====================
input.addEventListener("keydown",(e)=>{

    if(e.key==="Enter"){

        sendMessage();

    }

});