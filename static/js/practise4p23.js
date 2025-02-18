// Time constants
const CONSTANTS = {
    PART2_PREP_DURATION: 80,  // 1 minute + question reading time
    PART2_SPEAK_DURATION: 120,  // 2 minutes
    PART3_DURATION: 300,  // 5 minutes
};

// State management
const state = {
    selectedVoice: null,
    isSpeaking: false,
    currentQuestionIndex: 0,
    isRunning: false,
    questions: {
        part2: '',
        part3: []
    }
};

// Initialize Speech Synthesis
const synth = window.speechSynthesis;

// Encouraging phrases
const exclamations = [
    "So", "Sounds great", "Ok", "Awesome", "Your idea is good", "Good",
    "Interesting", "Impressive", "That's wonderful to hear!", "Fascinating",
    "Wow!", "Amazing!", "Incredible!", "Fantastic!", "Wonderful!", "Excellent!",
    "Nice!", "Brilliant!", "Outstanding!", "Great!", " ", " ", " ", " ", " "
];

// Voice initialization
async function initializeVoice() {
    try {
        const voices = await loadVoices();
        const femaleVoices = voices.filter(voice =>
            voice.name.toLowerCase().includes('female') &&
            voice.lang.startsWith('en')
        );
        state.selectedVoice = femaleVoices.length > 0 ?
            femaleVoices[Math.floor(Math.random() * femaleVoices.length)] :
            voices[0];
    } catch (error) {
        console.error('Error initializing voice:', error);
        throw new Error('Failed to initialize voice synthesis');
    }
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
    return new Promise((resolve, reject) => {
        if (!state.selectedVoice) {
            reject(new Error('Voice not initialized'));
            return;
        }

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = state.selectedVoice;
        utterance.rate = 0.85;
        utterance.pitch = 1;
        utterance.volume = 1;

        utterance.onstart = () => state.isSpeaking = true;
        utterance.onend = () => {
            state.isSpeaking = false;
            resolve();
        };
        utterance.onerror = (event) => {
            console.error('Speech synthesis error:', event);
            state.isSpeaking = false;
            reject(event);
        };

        synth.speak(utterance);
    });
}

// Questions handling
async function fetchQuestions() {
    try {
        const timestamp = new Date().getTime();
        const response = await fetch(`/question4p23?t=${timestamp}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        state.questions = {
            part2: data.part2 || '',
            part3: data.part3 || []
        };

        displayQuestions();
        return state.questions;
    } catch (error) {
        console.error('Error fetching questions:', error);
        showErrorModal('Failed to load questions. Please refresh the page.');
        throw error;
    }
}

function displayQuestions() {
    const questionContentDiv = document.getElementById('practise-question-content');
    if (!questionContentDiv) return;

    questionContentDiv.innerHTML = `
        <h4>Part 2 Question:</h4>
        <p>${state.questions.part2.replace(/\n/g, '<br>')}</p>
        <h4>Part 3 Questions:</h4>
        ${state.questions.part3.map((question, index) => 
            `<p>${index + 1}. ${question}</p>`
        ).join('')}
    `;
}

// Test parts execution
async function executeTest() {
    if (!state.questions.part2 || !state.questions.part3.length) {
        throw new Error('Questions not loaded');
    }

    try {
        await part1();
        if (state.isRunning) await part2();
        if (state.isRunning) await part3();
    } catch (error) {
        console.error('Test execution error:', error);
        showErrorModal('An error occurred during the test. Please refresh the page.');
    }
}

// Test Control
async function startTest() {
    state.isRunning = true;
    try {
        await executeTest();
    } catch (error) {
        console.error('Test error:', error);
    } finally {
        state.isRunning = false;
    }
}

// Utility Functions
const countdown = (duration) => new Promise((resolve) => setTimeout(resolve, duration * 1000));

function waitForNextQuestion() {
    return new Promise((resolve) => {
        const nextBtn = document.querySelector('.next-question-btn');
        if (!nextBtn) {
            console.error('Next question button not found');
            resolve();
            return;
        }

        const handleClick = () => {
            nextBtn.removeEventListener('click', handleClick);
            resolve();
        };
        nextBtn.addEventListener('click', handleClick);
    });
}

// Initialize application
async function initializeApp() {
    try {
        await initializeVoice();
        await fetchQuestions();
        startTest();
    } catch (error) {
        console.error('Initialization error:', error);
        showErrorModal('Failed to initialize the application. Please refresh the page.');
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', initializeApp);

document.getElementById('practise-reset-btn')?.addEventListener('click', async () => {
    try {
        await fetchQuestions();
    } catch (error) {
        console.error('Reset error:', error);
        showErrorModal('Failed to reset questions. Please try again.');
    }
});

// Error handling
function showErrorModal(message) {
    // Implement your error modal display logic here
    alert(message); // Fallback to alert if no modal implementation exists
}

// Completion tracking
async function sendCompletionTime() {
    try {
        const timestamp = new Date().toISOString();
        const response = await fetch('/save_completion_time', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ completion_time: timestamp, test_type: 'part 2 and 3' })
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        console.log('Completion time saved successfully');
    } catch (error) {
        console.error('Error saving completion time:', error);
        showErrorModal('Could not save completion time. Please try again.');
    }
}

// Part implementations
async function part1() {
    if (!state.isRunning) return;
    await speak("This test consists of two parts: Part 2 and Part 3, with each set of questions being randomly selected.");
}

async function part2() {
    if (!state.isRunning) return;

    await speak("In part 2, I'm going to give you a topic and I'd like you to talk about it for one to two minutes.");
    await speak("Before you talk, you'll have one minute to think about what you are going to say. You can make notes if you wish.");

    // Sử dụng câu hỏi part2 từ state.questions.part2
    if (state.questions.part2) {
        const questionText = state.questions.part2.split("You should say")[0];
        await speak(questionText);
    } else {
        console.error('Part2 question is not available');
    }

    await countdown(CONSTANTS.PART2_PREP_DURATION);

    if (state.isRunning) {
        await speak("All right? Remember you have one to two minutes for this, I will tell you when the time is up");
        await speak("Start speaking now.");

        // Wait for either next button click or timeout
        const timeoutPromise = countdown(CONSTANTS.PART2_SPEAK_DURATION);
        const nextButtonPromise = waitForNextQuestion();

        await Promise.race([timeoutPromise, nextButtonPromise]);

        // Update the index from state if needed
        state.currentQuestionIndex = 11;
    }
}

async function part3() {
    if (!state.isRunning) return;

    await speak("That is the end of Part 2. Now let's move on to Part 3.");
    await speak("You've been talking about a topic and I'd like to discuss with you some general questions related to it.");

    const startTime = Date.now();
    let questionIndex = 0;

    while (
        state.isRunning &&
        (Date.now() - startTime) < CONSTANTS.PART3_DURATION * 1000 &&
        questionIndex < state.questions.part3.length
    ) {
        const randomExclamation = exclamations[Math.floor(Math.random() * exclamations.length)].trim();
        if (randomExclamation) {
            await speak(randomExclamation);
        }
        await speak(state.questions.part3[questionIndex]);
        await waitForNextQuestion();
        questionIndex++;
    }

    if (state.isRunning) {
        await speak("That is the end of the speaking test. Thank you for your time.");
        await countdown(5);

        // Send completion data
        const submitted = await sendCompletionTime();
        if (submitted) {
            window.location.href = '/endTest';
        }
    }
}