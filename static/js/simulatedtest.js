// Global variables
let examinerSpeakingVideo;
let examinerSilentVideo;
let currentExaminerVideo;
let examinerGender = '';
let isSpeaking = false;
let currentStream = null;
let isFlipped = false;
let currentQuestionIndex = 0;
let questions = {};
let isRunning = false;
let mediaRecorder = null;

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
    const femaleVoices = voices.filter(voice =>
        voice.name.toLowerCase().includes('female') &&
        voice.lang.startsWith('en')
    );
    selectedVoice = femaleVoices.length > 0 ?
        femaleVoices[Math.floor(Math.random() * femaleVoices.length)] :
        voices[0];

    examinerGender = selectedVoice.name.toLowerCase().includes('female') ?
        'Female' : 'Male';
    console.log(`Selected voice: ${examinerGender}`);

    setVideoSources(examinerGender);
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

// Video source setup
function setVideoSources(gender) {
    examinerSpeakingVideo = document.getElementById('examiner-speaking');
    examinerSilentVideo = document.getElementById('examiner-silent');

    const speakingSource = examinerSpeakingVideo.querySelector('source');
    const silentSource = examinerSilentVideo.querySelector('source');

    if (gender === 'Female') {
        speakingSource.src = '/static/video/female_examiner_speaking.mp4';
        silentSource.src = '/static/video/female_examiner_silent.mp4';
    } else {
        speakingSource.src = '/static/video/male_examiner_speaking.mp4';
        silentSource.src = '/static/video/male_examiner_silent.mp4';
    }

    examinerSpeakingVideo.loop = true;
    examinerSilentVideo.loop = true;

    examinerSpeakingVideo.load();
    examinerSilentVideo.load();

    switchToSilentVideo();
}

// Video switching functions
function switchToSpeakingVideo() {
    if (currentExaminerVideo === examinerSpeakingVideo) return;
    if (examinerSilentVideo) examinerSilentVideo.style.display = 'none';
    if (examinerSpeakingVideo) {
        examinerSpeakingVideo.style.display = 'block';
        examinerSpeakingVideo.play().catch(console.error);
        currentExaminerVideo = examinerSpeakingVideo;
    }
}

function switchToSilentVideo() {
    if (!isSpeaking && currentExaminerVideo !== examinerSilentVideo) {
        if (examinerSpeakingVideo) examinerSpeakingVideo.style.display = 'none';
        if (examinerSilentVideo) {
            examinerSilentVideo.style.display = 'block';
            examinerSilentVideo.play().catch(console.error);
            currentExaminerVideo = examinerSilentVideo;
        }
    }
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
            switchToSpeakingVideo();
        };

        utterance.onend = function() {
            isSpeaking = false;
            switchToSilentVideo();
            resolve();
        };

        utterance.onerror = function(event) {
            console.error('Speech synthesis error:', event);
            isSpeaking = false;
            switchToSilentVideo();
            resolve();
        };

        synth.speak(utterance);
    });
}

// Webcam handling
async function setupWebcam() {
    try {
        const constraints = {
            video: {
                width: 320,
                height: 240
            }
        };
        currentStream = await navigator.mediaDevices.getUserMedia(constraints);
        const webcamVideo = document.getElementById('webcam-video');
        webcamVideo.srcObject = currentStream;
        document.querySelector('.no-signal').style.display = 'none';
        document.getElementById('camera-btn').classList.add('active');
    } catch (error) {
        console.error('Error accessing webcam:', error);
        document.querySelector('.no-signal').style.display = 'flex';
        showErrorModal('Cannot access camera. Please check permissions.');
    }
}

// UI Handlers
function setupUIHandlers() {
    const cameraBtn = document.getElementById('camera-btn');
    const flipBtn = document.getElementById('flip-btn');
    const chatBtn = document.getElementById('chat-btn');
    const settingsBtn = document.getElementById('settings-btn');
    const webcamVideo = document.getElementById('webcam-video');
    const noteInput = document.querySelector('.note-input');

    // Camera controls
    cameraBtn?.addEventListener('click', toggleCamera);
    flipBtn?.addEventListener('click', () => {
        if (currentStream) {
            isFlipped = !isFlipped;
            webcamVideo.style.transform = isFlipped ? 'scaleX(-1)' : 'scaleX(1)';
            flipBtn.classList.toggle('active');
        }
    });

    // Panel controls
    chatBtn?.addEventListener('click', toggleChat);
    settingsBtn?.addEventListener('click', toggleSettings);

    // Note taking
    if (noteInput) {
        noteInput.value = localStorage.getItem('examNotes') || '';
        noteInput.addEventListener('input', function() {
            localStorage.setItem('examNotes', this.value);
        });
    }

    // Click outside panels
    document.addEventListener('click', function(e) {
        const chatPanel = document.getElementById('chatPanel');
        const settingsPanel = document.getElementById('settingsPanel');

        if (!chatPanel?.contains(e.target) &&
            !chatBtn?.contains(e.target) &&
            !settingsPanel?.contains(e.target) &&
            !settingsBtn?.contains(e.target)) {
            chatPanel?.classList.remove('active');
            settingsPanel?.classList.remove('active');
            chatBtn?.classList.remove('active');
            settingsBtn?.classList.remove('active');
        }
    });

    // Dark mode
    document.getElementById('toggleDarkModeBtn')?.addEventListener('click', toggleDarkMode);
}

// UI Toggle Functions
function toggleCamera() {
    if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
        currentStream = null;
        document.getElementById('webcam-video').srcObject = null;
        document.querySelector('.no-signal').style.display = 'flex';
        document.getElementById('camera-btn').classList.remove('active');
        document.getElementById('flip-btn').classList.remove('active');
    } else {
        setupWebcam();
    }
}

function toggleChat() {
    const chatPanel = document.getElementById('chatPanel');
    const chatBtn = document.getElementById('chat-btn');
    chatPanel?.classList.toggle('active');
    chatBtn?.classList.toggle('active');
}

function toggleSettings() {
    const settingsPanel = document.getElementById('settingsPanel');
    const settingsBtn = document.getElementById('settings-btn');
    settingsPanel?.classList.toggle('active');
    settingsBtn?.classList.toggle('active');
}

function toggleDarkMode() {
    const elements = [
        document.body,
        document.querySelector('.examiner-frame'),
        document.querySelector('.webcam-frame'),
        document.querySelector('.taskbar'),
        document.querySelector('.next-question-btn'),
        ...document.querySelectorAll('.control-btn')
    ];

    elements.forEach(element => element?.classList.toggle('dark-mode'));
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

    // Create and show the question panel
    createQuestionPanel(questions[currentQuestionIndex]);

    await speak(questions[currentQuestionIndex].split("You should say")[0]);

    await countdown(PART2_PREP_DURATION);

    if (isRunning) {
        await speak("All right? Remember you have one to two minutes for this, i will tell you when the time is up");
        await speak("Start speaking now.");
        await countdown(PART2_SPEAK_DURATION);

        // Remove the panel after Part 2 is complete
        removeQuestionPanel();

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


// hàm xử lý lấy dữ liệu hiện tại và gửi về backend để lưu dữ liệu lịch sử làm bài
async function sendCompletionTime() {
    try {
        const timestamp = new Date().toISOString();
        const response = await fetch('/save_completion_time', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ completion_time: timestamp, test_type: 'simulated test' })        });
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

function showErrorModal(message) {
    let errorModal = document.getElementById('error-modal');
    if (!errorModal) {
        errorModal = document.createElement('div');
        errorModal.id = 'error-modal';
        errorModal.style.cssText = `
            display: none;
            position: fixed;
            top: 10%;
            left: 50%;
            transform: translateX(-50%);
            background: red;
            color: white;
            padding: 10px;
            z-index: 1000;
            border-radius: 5px;
            text-align: center;
        `;
        document.body.appendChild(errorModal);
    }
    errorModal.textContent = message;
    errorModal.style.display = 'block';
    setTimeout(() => {
        errorModal.style.display = 'none';
    }, 3000);
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
        showErrorModal('An error occurred during the test. Please try again.');
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
        console.log('Questions loaded:', questions);
    } catch (error) {
        console.error('Error fetching questions:', error);
        showErrorModal('Could not load test questions. Please try again.');
    }
}

// Initialization
document.addEventListener('DOMContentLoaded', async function() {
    await initializeVoice();
    setupUIHandlers();
    setupWebcam();
    startTest();
});

// Cleanup
window.addEventListener('beforeunload', function() {
    if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
    }
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
    }
});



// Function to format the Part 2 question
function formatPart2Question(question) {
    // Split the main topic and bullet points
    const [mainTopic, details] = question.split('You should say:');

    // Format the bullet points
    const bulletPoints = details.split('And')
        .join('')  // Remove 'And'
        .split(':')[0]  // Remove anything after the last colon
        .trim()
        .split('\n')
        .filter(point => point.trim())
        .map(point => point.trim());

    const explanation = question.split('And explain')[1].trim();

    // Create formatted HTML
    return `
        <div style="font-size: 16px; line-height: 1.6;">
            <p style="font-weight: bold; margin-bottom: 15px;">
                ${mainTopic.trim()}
            </p>
            <p style="margin-bottom: 10px; font-weight: bold;">
                You should say:
            </p>
            <ul style="list-style-type: disc; margin-left: 20px; margin-bottom: 15px;">
                ${bulletPoints.map(point => `<li style="margin-bottom: 8px;">${point}</li>`).join('')}
            </ul>
            <p style="margin-top: 10px;">
                And ${explanation}
            </p>
        </div>
    `;
}

// tạo bảng câu hỏi cho part 2
// Function to create and show the question panel
function createQuestionPanel(question) {
    // Create the panel element
    const panel = document.createElement('div');
    panel.id = 'part2-question-panel';
    panel.style.cssText = `
        position: fixed;
        left: 0;
        top: 0;
        width: 20%;
        height: 84vh;
        background-color: transparent;        
        padding: 20px;
        box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
        overflow-y: auto;
        z-index: 1000;
        font-family: Arial, sans-serif;
        border-right: 1px solid #ddd;
    `;

    // Add the formatted question
    panel.innerHTML = formatPart2Question(question);

    // Add to document
    document.body.appendChild(panel);
}

// Function to remove the question panel
function removeQuestionPanel() {
    const panel = document.getElementById('part2-question-panel');
    if (panel) {
        panel.remove();
    }
}