document.addEventListener("DOMContentLoaded", function() {
    console.log("DOM fully loaded and parsed");

    const startButton = document.getElementById("startButton");
    const connectWalletButton = document.getElementById("connectWalletButton"); // New wallet connect button

    if (startButton) {
        console.log("Start button found, adding event listener");
        startButton.addEventListener("click", startQuiz);
    } else {
        console.error("Start button not found");
    }

    if (connectWalletButton) {
        console.log("Connect Wallet button found, adding event listener");
        connectWalletButton.addEventListener("click", connectWallet);
    } else {
        console.error("Connect Wallet button not found");
    }

    updateScoreDisplay(); // Initialize score display
});

// Connect to the wallet using Ergo dApp Connector
async function connectWallet() {
    console.log("Connect Wallet button clicked");

    if (typeof ergo === "undefined" || typeof ergoConnector === "undefined") {
        alert("Wallet non trovato. Assicurati di avere Nautilus o un altro wallet compatibile con Ergo.");
        console.error("Ergo wallet or ergoConnector not found in environment");
        return;
    }

    try {
        await ergoConnector.nautilus.connect(); // Connect to Nautilus
        const address = await ergo.get_change_address(); // Get the primary address

        walletConnected = true;
        document.getElementById("walletStatus").textContent = `Wallet connesso: ${address}`;
        console.log("Wallet connesso con successo:", address);
    } catch (error) {
        console.error("Errore di connessione al wallet:", error);
        alert("Errore durante la connessione al wallet.");
    }
}

function startQuiz() {
    if (!walletConnected) {
        alert("Per iniziare il quiz, collega prima il tuo wallet Ergo.");
        return;
    }

    currentQuestionIndex = 0;
    correctAnswers = 0; // Reset score on start
    shuffleQuestions(); // Shuffle question order
    updateScoreDisplay(); // Update the score display to show 0

    const startButton = document.getElementById("startButton");
    if (startButton) {
        startButton.style.display = "none";
    }

    const quizContainer = document.getElementById("quizContainer");
    if (quizContainer) {
        quizContainer.style.display = "block";
    }

    showNextQuestion();
}

