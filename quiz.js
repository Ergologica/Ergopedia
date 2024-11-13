document.addEventListener("DOMContentLoaded", function() {
    const startButton = document.getElementById("startButton");
    const connectWalletButton = document.getElementById("connectWalletButton"); // New wallet connect button
    const themeToggle = document.getElementById("themeToggle"); // Theme toggle button

    if (startButton) {
        startButton.addEventListener("click", startQuiz);
    }

    if (connectWalletButton) {
        connectWalletButton.addEventListener("click", connectWallet);
    }

    if (themeToggle) {
        themeToggle.addEventListener("click", toggleTheme);
    }

    // Apply stored theme preference
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
        document.body.classList.add(storedTheme);
    }

    updateScoreDisplay(); // Initialize score display

    // Check for ergoConnector periodically if it's not available immediately
    const walletCheckInterval = setInterval(() => {
        if (typeof ergoConnector !== "undefined" && typeof ergoConnector.nautilus !== "undefined") {
            console.log("Ergo wallet connector detected.");
            clearInterval(walletCheckInterval); // Stop checking once ergoConnector is found
        } else {
            console.log("Waiting for Ergo wallet connector...");
        }
    }, 1000); // Check every 1 second
});

const quiz_questions = {
    "layer": {
        question: "Ergo è una blockchain di layer 1, layer 2 o layer 3?",
        correct: "layer 1",
        answers: ["layer 1", "layer 2", "layer 3"]
    },
    "consensus_type": {
        question: "Quale meccanismo di consenso utilizza Ergo?",
        correct: "proof of work",
        answers: ["proof of work", "proof of stake"]
    },
    "economics": {
        question: "Quale principio economico è importante nel design di Ergo?",
        correct: "domanda e offerta",
        answers: ["domanda e offerta", "inflazione", "costo opportunità"]
    },
    "ergo_tech": {
        question: "Quale tecnologia aiuta a garantire la privacy nelle transazioni di Ergo?",
        correct: "protocolli Sigma",
        answers: ["protocolli Sigma", "modello EUTXO", "pool di oracoli"]
    },
    "cryptography": {
        question: "Per cosa viene utilizzata una funzione di hash crittografica?",
        correct: "Garantire l'integrità dei dati",
        answers: ["Generare numeri casuali", "Eseguire operazioni aritmetiche", "Garantire l'integrità dei dati"]
    },
    "smart_contracts": {
        question: "Cosa sono gli smart contract su Ergo?",
        correct: "Accordi auto-esecutivi con i termini del contratto scritti direttamente nel codice.",
        answers: ["Firme digitali", "Identificatori decentralizzati", "Accordi auto-esecutivi con i termini del contratto scritti direttamente nel codice."]
    },
    "utxo_model": {
        question: "Cos'è il modello UTXO nella blockchain?",
        correct: "Modello di output di transazione non speso, dove ogni input di transazione fa riferimento a un output non speso precedente.",
        answers: ["Operazione Universale di Scambio Token", "Modello di output di transazione non speso, dove ogni input di transazione fa riferimento a un output non speso precedente.", "Oracle di esecuzione del token sottostante"]
    },
    "blockchain_benefits": {
        question: "Qual è un vantaggio chiave della tecnologia blockchain?",
        correct: "Immutabilità e trasparenza dei dati",
        answers: ["Controllo centralizzato dei dati", "Scalabilità limitata", "Immutabilità e trasparenza dei dati"]
    },
    "token_standards": {
        question: "Quale standard definisce come i token vengono creati e gestiti sulla blockchain di Ergo?",
        correct: "Proposte di miglioramento di Ergo (EIPs)",
        answers: ["Proposte di miglioramento di Bitcoin (BIPs)", "Proposte di miglioramento di Ergo (EIPs)", "Ethereum Request for Comments (ERCs)"]
    },
    "privacy_techniques": {
        question: "Quale tecnica di privacy viene utilizzata su Ergo per offuscare gli input e gli output delle transazioni?",
        correct: "Firme ad anello",
        answers: ["Proof of stake", "Wallet multi-firma", "Firme ad anello"]
    },
    "oracle_pools": {
        question: "Qual è lo scopo dei pool di oracoli nell'ecosistema di Ergo?",
        correct: "Fornire dati off-chain agli smart contract",
        answers: ["Minerare nuovi coin di Ergo", "Gestione decentralizzata dell'identità", "Fornire dati off-chain agli smart contract"]
    },
    "defi_applications": {
        question: "Quali tipi di applicazioni possono essere costruite sulla piattaforma di finanza decentralizzata (DeFi) di Ergo?",
        correct: "Exchange decentralizzati, piattaforme di prestito e altro",
        answers: ["Piattaforme di social media", "Piattaforme di gioco", "Exchange decentralizzati, piattaforme di prestito e altro"]
    }
};

let questionKeys = Object.keys(quiz_questions);
let currentQuestionIndex = 0;
let correctAnswers = 0;
let walletConnected = false; // Track wallet connection status

// Connect to the wallet using Ergo dApp Connector
async function connectWallet() {
    console.log("Connect Wallet button clicked");

    if (typeof ergoConnector === "undefined" || typeof ergoConnector.nautilus === "undefined") {
        alert("Wallet non trovato. Assicurati di avere Nautilus o un altro wallet compatibile con Ergo.");
        console.error("Ergo wallet or ergoConnector not found in environment");
        return;
    }

    try {
        await ergoConnector.nautilus.connect(); // Connect to Nautilus
        const address = await ergo.get_change_address(); // Get the primary address

        walletConnected = true;
        document.getElementById("walletStatusText").textContent = `Wallet connesso: ${address}`;
        document.getElementById("walletStatus").classList.add("connected");
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
    } else {
        console.error("Elemento quizContainer non trovato.");
    }

    showNextQuestion();
}

// Function to shuffle the questions randomly
function shuffleQuestions() {
    questionKeys = questionKeys.sort(() => Math.random() - 0.5);
}

function showNextQuestion() {
    if (currentQuestionIndex < questionKeys.length) {
        const questionKey = questionKeys[currentQuestionIndex];
        runQuiz(questionKey);
        currentQuestionIndex++;
    } else {
        showResult();
    }
}

function runQuiz(questionKey) {
    const questionData = quiz_questions[questionKey];
    if (!questionData) {
        console.error(`Dati della domanda non trovati per questionKey: ${questionKey}`);
        return;
    }

    const questionText = questionData.question;
    const answerOptions = questionData.answers.map(answer => `<button class="answerOption btn btn-outline-primary">${answer}</button>`).join(" ");

    const questionTextElement = document.getElementById("questionText");
    const answerOptionsElement = document.getElementById("answerOptions");

    if (questionTextElement && answerOptionsElement) {
        questionTextElement.textContent = questionText;
        answerOptionsElement.innerHTML = answerOptions;

        const answerButtons = document.querySelectorAll(".answerOption");
        answerButtons.forEach(button => {
            button.addEventListener("click", function() {
                checkAnswer(questionKey, button.textContent);
            });
        });
    } else {
        console.error("Elementi del quiz non trovati.");
    }
}

function checkAnswer(questionKey, userAnswer) {
    const questionData = quiz_questions[questionKey];
    const correctAnswer = questionData.correct;

    if (correctAnswer.toLowerCase() === userAnswer.toLowerCase()) {
        correctAnswers++;
        updateScoreDisplay(); // Update score display for a correct answer
        showFeedback(true);
        showNextQuestion();
    } else {
        showFeedback(false);
        restartQuiz();
    }
}

function restartQuiz() {
    alert("Risposta errata. Il quiz verrà riavviato.");
    correctAnswers = 0; // Reset score on restart
    updateScoreDisplay(); // Update the score display to show 0
    startQuiz(); // Reset the quiz
}

function showResult() {
    const quizContainer = document.getElementById("quizContainer");
    if (quizContainer) {
        quizContainer.style.display = "none";
    }

    const resultText = document.getElementById("resultText");
    if (resultText) {
        resultText.textContent = `Il tuo punteggio finale è: ${correctAnswers} su ${questionKeys.length}`;
    } else {
        console.error("Elemento di testo del risultato non trovato.");
    }

    const startButton = document.getElementById("startButton");
    if (startButton) {
        startButton.style.display = "block";
    }
}

function showFeedback(isCorrect) {
    const feedbackMessage = isCorrect ? "Bravo! Andiamo avanti..." : "Peccato, sei davvero un ergonauta?\nRiprova";
    alert(feedbackMessage);
    const feedbackColor = isCorrect ? "#28a745" : "#dc3545";
    const feedbackElement = document.getElementById("feedback");
    if (feedbackElement) {
        feedbackElement.textContent = feedbackMessage;
        feedbackElement.style.color = feedbackColor;
        feedbackElement.style.display = "block";
    }
}

function updateScoreDisplay() {
    const scoreDisplay = document.getElementById("scoreDisplay");
    if (scoreDisplay) {
        scoreDisplay.textContent = `Punteggio Corrente: ${correctAnswers}`;
    }
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const currentTheme = document.body.classList.contains('dark-mode') ? 'dark-mode' : 'light-mode';
    localStorage.setItem('theme', currentTheme);
}

