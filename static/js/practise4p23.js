// Time constants
const PART2_PREP_DURATION = 86;  // 1 minute + question reading time
const PART2_SPEAK_DURATION = 120;  // 2 minutes
const PART3_DURATION = 300;  // 5 minutes

// Global variables
let selectedVoice;
let isSpeaking = false;
let currentQuestionIndex = 0;
let questions = [];
let isRunning = false;

// Initialize Speech Synthesis
const synth = window.speechSynthesis;

// Encouraging phrases
const exclamations = [
    "So", "Sounds great", "Ok", "Awesome", "Your idea is good", "Good",
    "Interesting", "Impressive", "That's wonderful to hear!", "Fascinating",
    "Wow!", "Amazing!", "Incredible!", "Fantastic!", "Wonderful!", "Excellent!",
    "Nice!", "Brilliant!", "Outstanding!", "Great!", " ", " ", " ", " ", " ", " ", " ", " ",
];

// Voice initialization
async function initializeVoice() {
    const voices = await loadVoices();
    const femaleVoices = voices.filter(voice =>
        voice.name.toLowerCase().includes('female') &&
        voice.lang.startsWith('en')
    );
    selectedVoice = femaleVoices.length > 0 ?
        femaleVoices[Math.floor(Math.random() * femaleVoices.length)] :
        voices[0];
}

function loadVoices() {
    return new Promise((resolve) => {
        let voices = synth.getVoices();
        if (voices.length > 0) {
            resolve(voices);
        } else {
            synth.onvoiceschanged = () => {
                resolve(synth.getVoices());
            };
        }
    });
}

// Speech function
function speak(text) {
    return new Promise((resolve) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = selectedVoice;
        utterance.rate = 0.85;
        utterance.pitch = 1;
        utterance.volume = 1;

        utterance.onstart = function() {
            isSpeaking = true;
        };

        utterance.onend = function() {
            isSpeaking = false;
            resolve();
        };

        utterance.onerror = function(event) {
            console.error('Speech synthesis error:', event);
            isSpeaking = false;
            resolve();
        };

        synth.speak(utterance);
    });
}

// Test Parts
async function part1() {
    await speak("This test consists of two parts: Part 2 and Part 3, with each set of questions being randomly selected.");
}

async function part2() {
    if (!isRunning) return;

    await speak("In part 2, I'm going to give you a topic and I'd like you to talk about it for one to two minutes.");
    await speak("Before you talk, you'll have one minute to think about what you are going to say. You can make notes if you wish.");

    await speak(questions[currentQuestionIndex].split("You should say")[0]);

    await countdown(PART2_PREP_DURATION);

    if (isRunning) {
        await speak("All right? Remember you have one to two minutes for this, I will tell you when the time is up");
        await speak("Start speaking now.");
        await countdown(PART2_SPEAK_DURATION);
        currentQuestionIndex = 11;
    }
}

async function part3() {
    if (!isRunning) return;
    await speak("That is the end of Part 2. Now let's move on to Part 3.");
    await speak("You've been talking about a topic and I'd like to discuss with you some general questions related to it.");
    const startTime = Date.now();

    while (isRunning && (Date.now() - startTime) < PART3_DURATION * 1000) {
        if (currentQuestionIndex < questions.length) {
            const randomExclamation = exclamations[Math.floor(Math.random() * exclamations.length)];
            if (randomExclamation.trim() !== '') {
                await speak(randomExclamation);
            }
            await speak(questions[currentQuestionIndex]);
            await waitForNextQuestion();
            currentQuestionIndex++;
        } else {
            break;
        }
    }

    if (isRunning) {
        await speak("That is the end of the speaking test. Thank you for your time.");
        await new Promise(resolve => setTimeout(resolve, 5000));
        await sendCompletionTime();
        window.location.href = '/endTest';
    }
}

async function sendCompletionTime() {
    try {
        const timestamp = new Date().toISOString();
        const response = await fetch('/save_completion_time', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ completion_time: timestamp, test_type: 'part 2 and 3 only' })        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        console.log('Completion time saved successfully');
    } catch (error) {
        console.error('Error saving completion time:', error);
        showErrorModal('Could not save completion time. Please try again.');
    }
}


// Utility Functions
function countdown(duration) {
    return new Promise((resolve) => setTimeout(resolve, duration * 1000));
}

function waitForNextQuestion() {
    return new Promise((resolve) => {
        const nextBtn = document.querySelector('.next-question-btn');
        function handleClick() {
            nextBtn.removeEventListener('click', handleClick);
            resolve();
        }
        nextBtn.addEventListener('click', handleClick);
    });
}

// Test Control
async function startTest() {
    isRunning = true;
    try {
        await fetchQuestions();
        await part1();
        if (isRunning) await part2();
        if (isRunning) await part3();
    } catch (error) {
        console.error('Test error:', error);
    } finally {
        isRunning = false;
    }
}


function displayQuestions() {
    const questionContentDiv = document.getElementById('practise-question-content');
    questionContentDiv.innerHTML = ''; // Clear existing content

    // Display Part 2 question
    const part2Title = document.createElement('h4');
    part2Title.textContent = "Part 2 Question:";
    questionContentDiv.appendChild(part2Title);

    const part2Question = document.createElement('p');
    part2Question.innerHTML = questions.part2.replace(/\n/g, '<br>');
    questionContentDiv.appendChild(part2Question);

    // Display Part 3 questions
    const part3Title = document.createElement('h4');
    part3Title.textContent = "Part 3 Questions:";
    questionContentDiv.appendChild(part3Title);

    questions.part3.forEach((question, index) => {
        const questionElement = document.createElement('p');
        questionElement.textContent = `${index + 1}. ${question}`;
        questionContentDiv.appendChild(questionElement);
    });
}

// Function to reset questions
async function resetQuestions() {
    const questionContentDiv = document.getElementById('practise-question-content');
    questionContentDiv.innerHTML = ''; // Clear existing content
    displayQuestions(); // Display new questions
}

// Add event listener to reset button
document.getElementById('practise-reset-btn').addEventListener('click', resetQuestions);

// Call displayQuestions after fetching questions
async function fetchQuestions() {
    try {
        const timestamp = new Date().getTime();
        const response = await fetch(`/question4p23?t=${timestamp}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        questions = await response.json();
        displayQuestions(); // Display questions after fetching
    } catch (error) {
        console.error('Error fetching questions:', error);
    }
}

// Initialization
document.addEventListener('DOMContentLoaded', async function() {
    await initializeVoice();
    await fetchQuestions(); // Fetch and display questions on page load
    startTest();
});