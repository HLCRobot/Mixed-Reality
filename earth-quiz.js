const quizData = [
    {
        phase: "Construction Phase: Land Development",
        image: "construction.jpg",
        question: "Question: Large-scale tree cutting for parking lot construction primarily leads to:",
        options: [
            "A) Reduced vehicle emissions",
            "B) Increased property values nearby",
            "C) Destruction of wildlife habitats",
            "D) Improved soil fertility"
        ],
        correct: 2,
        explanation: "Explanation: Trees are vital to ecosystems, and their removal directly harms animal habitats."
    },
    {
        phase: "Boom Phase: Energy Use",
        image: "prosperity.jpg",
        question: "Question: During peak parking lot usage, the main pollutant emitted by vehicles is:",
        options: [
            "A) Pure water vapor",
            "B) Nitrogen oxides",
            "C) Oxygen",
            "D) Plant pollen"
        ],
        correct: 1,
        explanation: "Explanation: Vehicle exhaust releases nitrogen oxides, a major contributor to smog and acid rain."
    },
    {
        phase: "Decline Phase: Resource Waste",
        image: "decline.jpg",
        question: "Question: Long-term neglect of parking lot cracks can:",
        options: [
            "A) Promote natural plant growth",
            "B) Allow rainwater to seep in and contaminate groundwater",
            "C) Improve parking efficiency",
            "D) Reduce dust production"
        ],
        correct: 1,
        explanation: "Explanation: Cracks in asphalt let oil-contaminated rainwater seep into the soil, polluting groundwater."
    },
    {
        phase: "Abandonment Phase: Ecological Restoration",
        image: "abandonment.jpg",
        question: "Question: The most eco-friendly way to repurpose an abandoned parking lot is:",
        options: [
            "A) Building an open landfill",
            "B) Installing solar panels",
            "C) Converting it into a multi-story parking lot",
            "D) Creating a community green garden"
        ],
        correct: 3,
        explanation: "Explanation: A green garden restores ecological balance while providing communal green space."
    }
];

let currentQuestion = 0;

function initializeQuiz() {
    document.querySelectorAll('.quiz-option').forEach(option => {
        option.addEventListener('click', handleAnswer);
    });
    document.getElementById('quizNext').addEventListener('click', nextQuestion);
    loadQuestion(currentQuestion);
}

function loadQuestion(index) {
    const q = quizData[index];
    document.getElementById('quizPhase').textContent = q.phase;
    document.getElementById('quizImage').src = q.image;
    document.getElementById('quizQuestion').textContent = q.question;
    document.querySelectorAll('.quiz-option').forEach((option, i) => {
        option.textContent = q.options[i];
        option.classList.remove('correct', 'wrong');
        option.disabled = false;
    });
    document.getElementById('quizExplanation').style.display = 'none';
    document.getElementById('quizNext').style.display = 'none';
}

function handleAnswer(e) {
    const selectedIndex = parseInt(e.target.dataset.index);
    const correctIndex = quizData[currentQuestion].correct;
    
    document.querySelectorAll('.quiz-option').forEach(option => {
        option.disabled = true;
        const idx = parseInt(option.dataset.index);
        if(idx === correctIndex) {
            option.classList.add('correct');
        } else if(idx === selectedIndex) {
            option.classList.add('wrong');
        }
    });

    const explanation = document.getElementById('quizExplanation');
    explanation.textContent = quizData[currentQuestion].explanation;
    explanation.style.display = 'block';
    
    const nextBtn = document.getElementById('quizNext');
    nextBtn.style.display = 'block';
    nextBtn.textContent = currentQuestion === quizData.length - 1 ? 
        "Close the quiz mini-game" : "Next";
}

function nextQuestion() {
    if(currentQuestion < quizData.length - 1) {
        currentQuestion++;
        loadQuestion(currentQuestion);
    } else {
        document.getElementById('earthQuizModal').style.display = 'none';
        document.querySelector('.earth-btn').disabled = true;
        document.querySelector('.earth-icon').classList.add('active');
        document.getElementById('clue4').style.display = 'block';
        currentQuestion = 0; // Reset for next time
    }
}

