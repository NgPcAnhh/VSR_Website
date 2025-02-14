async function startConversion() {
    const fileInput = document.getElementById('fileInput');
    if (!fileInput.files[0]) {
        alert("Please select a WAV file first.");
        return;
    }

    const loadingBar = document.getElementById('loadingBar');
    const resultArea = document.getElementById('result');
    const analysisArea = document.querySelector('.result-box');

    // Visual feedback for loading
    loadingBar.style.width = '30%';
    resultArea.value = "Processing...";
    analysisArea.value = "Analyzing...";

    const formData = new FormData();
    formData.append('file', fileInput.files[0]);

    try {
        // Use your ngrok URL here - make sure to update this when the ngrok URL changes
        const apiUrl = "https://e493-35-243-188-201.ngrok-free.app/transcribe_and_process";  // đổi url theo server api khởi tạo

        const response = await fetch(apiUrl, {
            method: 'POST',
            body: formData,
            // Add CORS headers if needed
            headers: {
                'Accept': 'application/json',
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Fail to convert");
        }

        const data = await response.json();

        // Log the full API response
        console.log("Full API Response:", data);

        // Format the conversation data
        if (data.conversation && Array.isArray(data.conversation)) {
            let formattedOutput = "=== Result ===\n\n";

            data.conversation.forEach((line) => {
                // Add formatting for different parts
                if (line.startsWith("---")) {
                    // Section headers
                    formattedOutput += `\n${line}\n`;
                } else if (line.startsWith("examiner:")) {
                    // Examiner questions
                    formattedOutput += ` ${line.replace("examiner:", "Examiner: ")}\n`;
                } else if (line.startsWith("candidate:")) {
                    // Candidate answers
                    formattedOutput += ` ${line.replace("candidate:", "Candidate: ")}\n`;
                } else {
                    // Other lines
                    formattedOutput += `${line}\n`;
                }
            });

            resultArea.value = formattedOutput;
        } else {
            resultArea.value = "No conversation data returned";
        }

        // Format the analysis data
        if (data.relevance && data.analysis) {
            let analysisOutput = "=== Relevance Analysis ===\n\n";
            analysisOutput += "Relevance:\n";
            data.relevance.forEach((item) => {
                analysisOutput += `Part ${item.part_number} - ${item.label} (${item.relevance_score.toFixed(2)}%)\n`;
                analysisOutput += `Question: ${item.question}\n`;
                analysisOutput += `Answer: ${item.answer}\n\n`;
            });

            analysisOutput += "Grammar Analysis:\n";
            Object.keys(data.analysis).forEach((part) => {
                const analysis = data.analysis[part];
                analysisOutput += `Part ${part}\n`;
                analysisOutput += `Question: ${analysis.question}\n`;
                analysisOutput += `Answer: ${analysis.answer}\n`;

                if (analysis.errors && analysis.errors.length > 0) {
                    analysis.errors.forEach((error) => {
                        analysisOutput += `Error: ${error.text} (${error.error_type}) - ${error.message}\n`;
                        analysisOutput += `Suggestion: ${error.suggestion}\n\n`;
                    });
                } else {
                    analysisOutput += "No errors found\n\n";
                }
            });

            analysisArea.value = analysisOutput;
        } else {
            analysisArea.value = "No analysis data returned";
        }

        loadingBar.style.width = '100%';

    } catch (error) {
        resultArea.value = "Error: " + error.message;
        analysisArea.value = "Error: " + error.message;
        loadingBar.style.width = '0%';
    } finally {
        // Reset loading bar after a delay
        setTimeout(() => {
            loadingBar.style.width = '0%';
        }, 2000);
    }
}