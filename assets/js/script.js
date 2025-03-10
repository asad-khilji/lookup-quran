 async function searchJSON() {
            let inputField = document.getElementById("userInput");
            let query = inputField.value.trim().toLowerCase();
            if (query === "") return;
            
            let chatBox = document.getElementById("chatBox");
            
            let userMessage = document.createElement("div");
            userMessage.classList.add("message", "user");
            userMessage.textContent = query;
            chatBox.appendChild(userMessage);
            
            inputField.value = "";
            
            setTimeout(async () => {
                let botMessage = document.createElement("div");
                botMessage.classList.add("message", "bot");
                
                try {
                    let response = await fetch("./assets/data/responses.json");
                    let data = await response.json();
                    
                    let result = Object.entries(data).find(([key, value]) => key.toLowerCase().includes(query) || value.toLowerCase().includes(query));
                    
                    botMessage.textContent = result ? result[1] : "No matching data found.";
                } catch (error) {
                    botMessage.textContent = "Error fetching data.";
                }
                
                chatBox.appendChild(botMessage);
                chatBox.scrollTop = chatBox.scrollHeight;
            }, 1000);
        }