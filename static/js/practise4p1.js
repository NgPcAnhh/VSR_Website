// Time constants
const PART1_DURATION = 300;  // 5 minutes

// Global variables
let selectedVoice;
let isSpeaking = false;
let currentQuestionIndex = 0;
let questions = {};
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
    await speak("This is the simulated speaking test and I'm your examiner. Okay, Please make sure your microphone is on and your area is silent.");
    await speak("You should adjust the volume before the test. Let's start!");
    await speak("Now, in this first part, I'd like to ask you some questions about yourself.");
    const startTime = Date.now();

    while (isRunning && (Date.now() - startTime) < PART1_DURATION * 1000) {
        if (currentQuestionIndex < 10) {
            if (currentQuestionIndex > 0) {
                const randomExclamation = exclamations[Math.floor(Math.random() * exclamations.length)];
                if (randomExclamation.trim() !== '') {
                    await speak(randomExclamation);
                }
            }
            await speak(questions[currentQuestionIndex]);
            await waitForNextQuestion();
            currentQuestionIndex++;
        } else {
            break;
        }
    }

    if (isRunning) {
        await speak("That is the end of part 1 of the speaking test. ");
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
            body: JSON.stringify({ completion_time: timestamp, test_type: 'part 1 only' })        });
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
    } catch (error) {
        console.error('Test error:', error);
    } finally {
        isRunning = false;
    }
}

// Function to display questions in the div
function displayQuestions() {
    const questionContentDiv = document.getElementById('practise-question-content');
    questionContentDiv.innerHTML = ''; // Clear existing content
    questions.forEach((question, index) => {
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
        const response = await fetch(`/question4p1?t=${timestamp}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        questions = await response.json();
        console.log('Questions loaded:', questions);
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