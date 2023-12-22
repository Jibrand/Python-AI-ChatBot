const chatbotToggler = document.querySelector(".chatbot-toggler");
const closeBtn = document.querySelector(".close-btn");
const chatbox = document.querySelector(".chatbox");
const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");

let question = null; // Variable to store user's message
const API_KEY = "PASTE-YOUR-API-KEY"; // Paste your API key here
const inputInitHeight = chatInput.scrollHeight;

const createChatLi = (message, className) => {
    // Create a chat <li> element with passed message and className
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", `${className}`);
    let chatContent = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined robot">smart_toy</span><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi; // return chat <li> element
}

 
// Modify the generateResponse function to directly update the chatbox
const generateResponse = (chatElement) => {
    const API_URL = "https://puthon-chabot.onrender.com/ask";
    const messageElement = chatElement.querySelector("p");

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: question }),
    }

    console.log('API Request:', requestOptions);

    fetch(API_URL, requestOptions)
        .then(response => {
            console.log('API Response Status:', response.status);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('API Response Data:', data);

            if (!data || !data.answer) {
                throw new Error('Invalid response format from the backend.');
            }

            const cleanedResponse = data.answer.replace(/(^\?\s*|\s*$)/g, '');
            console.log('Cleaned Response:', cleanedResponse);

            // Update the chatbox with the bot's response
            const incomingChatLi = createChatLi(cleanedResponse, "incoming");
            chatbox.appendChild(incomingChatLi);

            // Scroll to the bottom after adding messages
            chatbox.scrollTo(0, chatbox.scrollHeight);
        })
        .catch(error => {
            console.error('Error:', error);
            // Handle error response
            const errorLi = createChatLi("Error processing the request. Please try again.", "error-incoming");
            chatbox.appendChild(errorLi);
            chatbox.scrollTo(0, chatbox.scrollHeight);
        });
}



const handleChat = () => {
    question = chatInput.value.trim(); // Get user entered message and remove extra whitespace
    if (!question) return;

    // Clear the input textarea and set its height to default
    chatInput.value = "";
    chatInput.style.height = `${inputInitHeight}px`;

    // Append the user's message to the chatbox
    const outgoingChatLi = createChatLi(question, "outgoing");
    chatbox.appendChild(outgoingChatLi);
    chatbox.scrollTo(0, chatbox.scrollHeight);

    // Call generateResponse to handle the API call and update the chatbox
    generateResponse(outgoingChatLi);
}

chatInput.addEventListener("input", () => {
    // Adjust the height of the input textarea based on its content
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
    // If Enter key is pressed without Shift key and the window 
    // width is greater than 800px, handle the chat
    if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handleChat();
    }
});

sendChatBtn.addEventListener("click", handleChat);
closeBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));