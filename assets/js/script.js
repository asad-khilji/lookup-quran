function getLevenshteinDistance(a, b) {
    const dp = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));
    for (let i = 0; i <= a.length; i++) dp[i][0] = i;
    for (let j = 0; j <= b.length; j++) dp[0][j] = j;

    for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
            const cost = a[i - 1] === b[j - 1] ? 0 : 1;
            dp[i][j] = Math.min(
                dp[i - 1][j] + 1,
                dp[i][j - 1] + 1,
                dp[i - 1][j - 1] + cost
            );
        }
    }
    return dp[a.length][b.length];
}

function findBestMatch(query, data) {
    let bestMatch = null;
    let lowestDistance = Infinity;

    for (const [key, value] of Object.entries(data)) {
        const distanceKey = getLevenshteinDistance(query, key.toLowerCase());
        const distanceValue = getLevenshteinDistance(query, value.toLowerCase());

        const minDistance = Math.min(distanceKey, distanceValue);
        if (minDistance < lowestDistance) {
            lowestDistance = minDistance;
            bestMatch = value;
        }
    }

    return (lowestDistance <= 5) ? bestMatch : null; // 5 is a fuzzy threshold
}

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

            let result = findBestMatch(query, data);
            botMessage.textContent = result || "No smart match found.";
        } catch (error) {
            botMessage.textContent = "Error fetching data.";
        }

        chatBox.appendChild(botMessage);
        chatBox.scrollTop = chatBox.scrollHeight;
    }, 1000);
}
