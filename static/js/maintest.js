let questions = {};
let isRunning = false;

const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'en-UK';
recognition.interimResults = false;
recognition.continuous = false;

const synth = window.speechSynthesis;
let selectedVoice;
let currentQuestionIndex = 0;

const exclamations = ["So", "Sounds great", "Ok", "Awesome", "Your idea is good", "Good", "Interesting", "Impressive", "That's wonderful to hear!", "Fascinating", "Wow!", "Amazing!", "Incredible!", "Fantastic!", "Wonderful!", "Excellent!", " ", "Fascinating!", "Interesting!", " ", " ", "Brilliant!", " ", " ", "Impressive!", "Great!", " ", " ", " ", " ", " ", " "];

const PART1_DURATION = 300; // 5 minutes
const PART2_PREP_DURATION = 60; // 1 minute
const PART2_SPEAK_DURATION = 120; // 2 minutes
const PART3_DURATION = 300; // 5 minutes

document.addEventListener('DOMContentLoaded', async function () {
  if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
    alert("Your browser does not support speech recognition. Please use Chrome or Edge.");
    return;
  }

  try {
    displayLoading(true);
    await fetchQuestions();
    await initializeVoice();
    startTest();
  } catch (error) {
    console.error('Initialization error:', error);
    alert("Failed to initialize the test. Please try again later.");
  } finally {
    displayLoading(false);
  }
});

window.addEventListener('beforeunload', function () {
  questions = {};
});

function displayLoading(show) {
  const loadingElement = document.getElementById('loading');
  if (loadingElement) {
    loadingElement.style.display = show ? 'block' : 'none';
  }
}

async function fetchQuestions() {
  const response = await fetch('/generate_questions');
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  questions = await response.json();
  console.log('Generated Questions:', questions);
}

async function initializeVoice() {
  const voices = await loadVoices();
  selectedVoice = selectRandomVoice(voices);
  if (!selectedVoice) {
    alert("No suitable voice found. Using the default system voice.");
    selectedVoice = voices[0];
  }
}

function loadVoices() {
  return new Promise((resolve) => {
    const voices = synth.getVoices();
    if (voices.length > 0) {
      resolve(voices);
    } else {
      synth.onvoiceschanged = () => {
        resolve(synth.getVoices());
      };
    }
  });
}

function selectRandomVoice(voices) {
  // Filter for female voices only
  const availableVoices = voices.filter(voice => voice.name.includes('Female'));
  return availableVoices.length > 0 ? availableVoices[Math.floor(Math.random() * availableVoices.length)] : voices[0];
}

function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.voice = selectedVoice;
  utterance.rate = 1;
  utterance.pitch = 1;
  utterance.volume = 1;

  utterance.onend = () => console.log('SpeechSynthesisUtterance.onend');
  utterance.onerror = (event) => console.error('SpeechSynthesisUtterance.onerror', event);

  synth.speak(utterance);
}

function countdown(duration) {
  return new Promise((resolve) => setTimeout(resolve, duration * 1000));
}

async function speakAndWaitForNext(text) {
  return new Promise((resolve) => {
    speak(text);
    document.querySelector('.next-question-btn').addEventListener('click', function onClick() {
      document.querySelector('.next-question-btn').removeEventListener('click', onClick);
      resolve();
    });
  });
}

function handleNextQuestion() {
  if (!isRunning) return;

  if (currentQuestionIndex < 10) {
    speak(questions[currentQuestionIndex]);
    currentQuestionIndex++;
  } else if (currentQuestionIndex === 10) {
    part2();
  } else if (currentQuestionIndex >= 11) {
    part3();
  }
}

async function startTest() {
  isRunning = true;
  try {
    await part1();
    if (isRunning) await part2();
    if (isRunning) await part3();
  } catch (error) {
    console.error('Test encountered an error:', error);
    alert("An error occurred during the test. Please try again.");
  } finally {
    isRunning = false;
  }
}

async function part1() {
  console.log("\n=== Starting Part 1 ===");
  speak("This is the simulated speaking test and I'm your examiner. Can you hear my voice? Please ensure your microphone is on, and keep your surroundings silent. Are you ready? OK, let's start.");

  const startTime = Date.now();
  while (isRunning && (Date.now() - startTime) < PART1_DURATION * 1000) {
    if (currentQuestionIndex < 10) {
      // Select a random exclamation before each question (except the first one)
      if (currentQuestionIndex > 0) {
        const randomExclamation = exclamations[Math.floor(Math.random() * exclamations.length)];
        if (randomExclamation.trim() !== '') {
          speak(randomExclamation);
        }
      }
      await speakAndWaitForNext(questions[currentQuestionIndex]);
      currentQuestionIndex++;
    } else {
      break;
    }
  }

  if (isRunning) {
    speak("That is the end of part 1. Now we will turn to part 2.");
    currentQuestionIndex = 10;
  }
}

async function part2() {
  if (!isRunning) return;

  console.log("\n=== Starting Part 2 ===");
  speak("In part 2, I will give you a topic. You'll have one minute to prepare and then one to two minutes to talk about it.");

  speak(questions[10]);
  console.log("\nPreparation time: 60 seconds");

  // Countdown timer in the console
  for (let i = PART2_PREP_DURATION; i > 0; i--) {
    console.log(`Time remaining: ${i} seconds`);
    await countdown(1);
  }

   speak("All right? Remember, you have one to two minutes for this, so don't worry if I stop you. I'll tell you when the time is up. Can you start speaking now?")

  // Wait for either 2 minutes or the "next question" button click
  const speakDurationPromise = countdown(PART2_SPEAK_DURATION);
  const nextQuestionPromise = new Promise((resolve) => {
    document.querySelector('.next-question-btn').addEventListener('click', function onClick() {
      document.querySelector('.next-question-btn').removeEventListener('click', onClick);
      resolve();
    });
  });

  await Promise.race([speakDurationPromise, nextQuestionPromise]);

  if (isRunning) {
    speak("Time's up. Let's move to the next part.");
    currentQuestionIndex = 11;
  }
}

async function part3() {
  if (!isRunning) return;

  console.log("\n=== Starting Part 3 ===");
  speak("Now, we'll discuss some general questions related to the topic you just talked about.");

  const startTime = Date.now();
  while (isRunning && (Date.now() - startTime) < PART3_DURATION * 1000) {
    if (currentQuestionIndex < questions.length) {
      // Select a random exclamation before each question
      const randomExclamation = exclamations[Math.floor(Math.random() * exclamations.length)];
      if (randomExclamation.trim() !== '') {
        speak(randomExclamation);
      }
      await speakAndWaitForNext(questions[currentQuestionIndex]);
      currentQuestionIndex++;
    } else {
      break;
    }
  }

  if (isRunning) {
      speak("That is the end of the speaking test. Thank you for your time.")
      speak("The speaking test is now complete. Thank you for your time.")
      speak("The recording has been saved. You can now exit the test. Goodbye!")  }
}