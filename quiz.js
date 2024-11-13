document.addEventListener("DOMContentLoaded", function() {
    const startButton = document.getElementById("startButton");
    if (startButton) {
        startButton.addEventListener("click", startQuiz);
    }
    updateScoreDisplay(); // Initialize score display
});

const quiz_questions = {
    "layer": {
        question: "Is Ergo a layer 1, layer 2, or layer 3 blockchain?",
        correct: "layer 1",
        answers: ["layer 1", "layer 2", "layer 3"]
    },
    "consensus_type": {
        question: "What consensus mechanism does Ergo use?",
        correct: "proof of work",
        answers: ["proof of work", "proof of stake"]
    },
    "economics": {
        question: "Which economic principle is important in Ergo's design?",
        correct: "supply and demand",
        answers: ["supply and demand", "inflation", "opportunity cost"]
    },
    "ergo_tech": {
        question: "Which technology helps ensure privacy in Ergo transactions?",
        correct: "Sigma protocols",
        answers: ["Sigma protocols", "EUTXO model", "Oracle pools"]
    },
    "cryptography": {
        question: "What is a cryptographic hash function used for?",
        correct: "Securing data integrity",
        answers: ["Generating random numbers", "Performing arithmetic operations", "Securing data integrity"]
    },
    "smart_contracts": {
        question: "What are smart contracts in Ergo?",
        correct: "Self-executing agreements with the terms of the contract directly written into code.",
        answers: ["Digital signatures", "Decentralized identifiers", "Self-executing agreements with the terms of the contract directly written into code."]
    },
    "utxo_model": {
        question: "What is the UTXO model in blockchain?",
        correct: "Unspent Transaction Output model, where each transaction input references a previous unspent output.",
        answers: ["Universal Token Exchange Operation", "Unspent Transaction Output model, where each transaction input references a previous unspent output.", "Underlying Token Execution Oracle"]
    },
    "blockchain_benefits": {
        question: "What is a key benefit of blockchain technology?",
        correct: "Immutability and transparency of data",
        answers: ["Centralized control of data", "Limited scalability", "Immutability and transparency of data"]
    },
    "token_standards": {
        question: "Which standard defines how tokens are created and managed on the Ergo blockchain?",
        correct: "Ergo Improvement Proposals (EIPs)",
        answers: ["Bitcoin Improvement Proposals (BIPs)", "Ergo Improvement Proposals (EIPs)", "Ethereum Request for Comments (ERCs)"]
    },
    "privacy_techniques": {
        question: "Which privacy technique is used in Ergo to obfuscate transaction inputs and outputs?",
        correct: "Ring signatures",
        answers: ["Proof of stake", "Multi-signature wallets", "Ring signatures"]
    },
    "oracle_pools": {
        question: "What is the purpose of oracle pools in the Ergo ecosystem?",
        correct: "Providing off-chain data to smart contracts",
        answers: ["Mining new Ergo coins", "Decentralized identity management", "Providing off-chain data to smart contracts"]
    },
    "defi_applications": {
        question: "Which type of applications can be built on Ergo's decentralized finance (DeFi) platform?",
        correct: "Decentralized exchanges, lending platforms, and more",
        answers: ["Social media platforms", "Gaming platforms", "Decentralized exchanges, lending platforms, and more"]
    }
};

let questionKeys = Object.keys(quiz_questions);
let currentQuestionIndex = 0;
let correctAnswers = 0;

function startQuiz() {
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
        console.error(`Question data not found for questionKey: ${questionKey}`);
        return;
    }

    const questionText = questionData.question;
    const answerOptions = questionData.answers.map(answer => `<button class="answerOption">${answer}</button>`).join("");

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
        console.error("Quiz elements not found.");
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
    alert("Incorrect answer. The quiz will restart.");
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
        resultText.textContent = `Your final score is: ${correctAnswers} out of ${questionKeys.length}`;
    } else {
        console.error("Result text element not found.");
    }
}

function showFeedback(isCorrect) {
    const feedback = isCorrect ? "Good job! Let's go..." : "So sorry, are you even an ergonaut?\nTry again";
    alert(feedback);
}

function updateScoreDisplay() {
    const scoreDisplay = document.getElementById("scoreDisplay");
    if (scoreDisplay) {
        scoreDisplay.textContent = `Current Score: ${correctAnswers}`;
    }
}

