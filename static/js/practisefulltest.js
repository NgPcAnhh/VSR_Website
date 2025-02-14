// Global variables
let currentQuestionIndex = 0;
let questions = {};
let isRunning = false;
let isSpeaking = false;

// Initialize Speech Synthesis
const synth = window.speechSynthesis;
let selectedVoice;

// Time constants
const PART1_DURATION = 300;  // 5 minutes
const PART2_PREP_DURATION = 86;  // 1 minute + question reading time
const PART2_SPEAK_DURATION = 120;  // 2 minutes
const PART3_DURATION = 300;  // 5 minutes

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
    selectedVoice = voices[0];  // Select the first available voice
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
     await speak("This is the simulated speaking test and I'm your examiner. Okay, Please make sure your microphone is on and your erea is silent.");
     await speak("You should adjust the volume before the test. Let's start!");
     await speak(" Now, in this first part, I'd like to ask you some questions about yourself.");
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
        await speak("That is the end of Part 1. Now let's move on to Part 2.");
        currentQuestionIndex = 10;
    }
}

async function part2() {
    if (!isRunning) return;

    await speak("In part 2, I'm going to give you a topic and I'd like you to talk about it for one to two minutes.");
    await speak("Before you talk, you'll have one minute to think about what you are going to say. You can make notes if you wish.");


    await speak(questions[currentQuestionIndex].split("You should say")[0]);

    await countdown(PART2_PREP_DURATION);

    if (isRunning) {
        await speak("All right? Remember you have one to two minutes for this, i will tell you when the time is up");
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
        if (currentQuestionIndex < Object.keys(questions).length) {
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
            body: JSON.stringify({ completion_time: timestamp, test_type: 'full test practise' })        });
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

function displayQuestion() {
    const questionContent = document.getElementById('practise-question-content');
    questionContent.innerHTML = ''; // Clear existing content

    const part1Questions = Object.values(questions).slice(0, 10);
    const part2Question = Object.values(questions)[10];
    const part3Questions = Object.values(questions).slice(11);

    // Display Part 1 questions
    const part1Header = document.createElement('h3');
    part1Header.textContent = '--- Part 1 ---';
    questionContent.appendChild(part1Header);

    part1Questions.forEach((question, index) => {
        const questionElement = document.createElement('div');
        questionElement.textContent = `${index + 1}. ${question}`;
        questionContent.appendChild(questionElement);
    });

    // Display Part 2 question
    const part2Header = document.createElement('h3');
    part2Header.textContent = '--- Part 2 ---';
    questionContent.appendChild(part2Header);

    if (part2Question) {
        const part2QuestionElement = document.createElement('div');
        const [mainQuestion, subQuestions] = part2Question.split('You should say:');
        part2QuestionElement.innerHTML = `${mainQuestion}<br><br>You should say:<br>${subQuestions.replace(/\n/g, '<br>')}`;
        questionContent.appendChild(part2QuestionElement);
    }

    // Display Part 3 questions
    const part3Header = document.createElement('h3');
    part3Header.textContent = '--- Part 3 ---';
    questionContent.appendChild(part3Header);

    part3Questions.forEach((question, index) => {
        const questionElement = document.createElement('div');
        questionElement.textContent = `${index + 12}. ${question}`;
        questionContent.appendChild(questionElement);
    });
}

// Test Control
async function startTest() {
    isRunning = true;
    try {
        await fetchQuestions();
        displayQuestion(); // Call displayQuestion after fetching questions
        await part1();
        if (isRunning) await part2();
        if (isRunning) await part3();
    } catch (error) {
        console.error('Test error:', error);
    } finally {
        isRunning = false;
    }
}

// Data Fetching
async function fetchQuestions() {
    try {
        const timestamp = new Date().getTime();
        const response = await fetch(`/generate_questions?t=${timestamp}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        questions = await response.json();
        console.log('Fetched questions:', questions);
    } catch (error) {
        console.error('Error fetching questions:', error);
    }
}

// Timer Function
function startTimer() {
    const hoursElement = document.getElementById('hours');
    const minutesElement = document.getElementById('minutes');
    const secondsElement = document.getElementById('seconds');
    let totalSeconds = 0;

    setInterval(() => {
        totalSeconds++;
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        hoursElement.textContent = hours.toString().padStart(2, '0');
        minutesElement.textContent = minutes.toString().padStart(2, '0');
        secondsElement.textContent = seconds.toString().padStart(2, '0');
    }, 1000);
}

// Initialization
document.addEventListener('DOMContentLoaded', async function() {
    await initializeVoice();
    startTimer(); // Start the timer when the page loads
    startTest();
});