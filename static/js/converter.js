// Constants
const MAX_FILE_SIZE = 200 * 1024 * 1024; // 200MB

// Event listener for file input change
document.getElementById('fileInput').addEventListener('change', function(e) {
    document.getElementById('fileName').textContent = e.target.files[0].name;
});

// Function to start the conversion process
async function startConversion() {
    const fileInput = document.getElementById('fileInput');
    const convertBtn = document.getElementById('convertBtn');
    const spinner = convertBtn.querySelector('.loading-spinner');
    const progressFill = document.querySelector('.progress-fill');

    try {
        // Validate file input
        if (!fileInput.files[0]) {
            showError('Please select an audio file first!');
            return;
        }

        const file = fileInput.files[0];
        if (file.size > MAX_FILE_SIZE) {
            showError('File too large (maximum 200MB)');
            return;
        }

        // Update UI for loading state
        convertBtn.classList.add('loading');
        spinner.style.display = 'block';
        document.querySelector('.progress-bar').style.display = 'block';
        updateStatus('Analyzing file...');

        // Start conversion
        const startTime = performance.now();
        const mp3Blob = await processAudio(file);
        const duration = ((performance.now() - startTime) / 1000).toFixed(1);

        // Update UI with results
        updateStatus(`Completed in ${duration}s`);
        showDownloadLink(mp3Blob, file.name);
    } catch (error) {
        showError(error.message);
    } finally {
        // Reset UI
        convertBtn.classList.remove('loading');
        spinner.style.display = 'none';
        progressFill.style.width = '0%';
    }
}

// Function to process audio file
async function processAudio(file) {
    const arrayBuffer = await file.arrayBuffer();
    const audioContext = new OfflineAudioContext(1, 1, 44100);

    // Decode audio data
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    // Convert to MP3 format
    return audioBufferToMP3(audioBuffer);
}

// Function to convert AudioBuffer to MP3 Blob
function audioBufferToMP3(buffer) {
    const numChannels = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const mp3Encoder = new lamejs.Mp3Encoder(numChannels, sampleRate, 128);
    const samples = buffer.getChannelData(0);
    const mp3Data = [];

    let sampleBlockSize = 1152;
    for (let i = 0; i < samples.length; i += sampleBlockSize) {
        const sampleChunk = samples.subarray(i, i + sampleBlockSize);
        const mp3buf = mp3Encoder.encodeBuffer(sampleChunk);
        if (mp3buf.length > 0) {
            mp3Data.push(new Int8Array(mp3buf));
        }
    }
    const mp3buf = mp3Encoder.flush();
    if (mp3buf.length > 0) {
        mp3Data.push(new Int8Array(mp3buf));
    }

    return new Blob(mp3Data, { type: 'audio/mp3' });
}

// Helper function to update status text
function updateStatus(text) {
    document.getElementById('status').textContent = text;
}

// Helper function to show error message
function showError(message) {
    const errorEl = document.getElementById('errorMessage');
    errorEl.textContent = message;
    errorEl.style.display = 'block';
    setTimeout(() => errorEl.style.display = 'none', 5000);
}

// Helper function to show download link
function showDownloadLink(blob, originalName) {
    const downloadSection = document.getElementById('downloadSection');
    const downloadLink = document.getElementById('downloadLink');

    const url = URL.createObjectURL(blob);
    downloadLink.href = url;
    downloadLink.download = `${originalName.split('.')[0]}_VSR.mp3`;

    downloadSection.style.opacity = '1';
    downloadSection.style.transform = 'translateY(0)';
}
