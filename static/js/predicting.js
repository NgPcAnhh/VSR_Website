document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('predict-form');
  const loader = document.getElementById('loader');
  const formContainer = document.getElementById('form-container');
  const resultContainer = document.getElementById('result-container');
  const resultDetails = document.getElementById('result-details');
  const resetBtn = document.getElementById('reset-btn');

  form.addEventListener('submit', async function(e) {
    e.preventDefault();

    // Hide form and display loader
    formContainer.classList.add('hidden');
    loader.classList.remove('hidden');

    // Gather form data
    const formData = {
      current_band: document.getElementById('current_band').value,
      avg_hours: document.getElementById('avg_hours').value,
      total_days: document.getElementById('total_days').value,
      start_date: document.getElementById('start_date').value,
      nationality: document.getElementById('nationality').value,
      native_language: document.getElementById('native_language').value,
      type_of_study: document.getElementById('type_of_study').value,
      english_experience_years: document.getElementById('english_experience_years').value,
      age: document.getElementById('age').value
    };

    try {
      const response = await fetch('/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      loader.classList.add('hidden');
      resultContainer.classList.remove('hidden');

      if (data.error) {
        resultDetails.innerHTML = `<p style="color:red;">Error: ${data.error}</p>`;
      } else {
        resultDetails.innerHTML = `
          <p><strong>Current Band:</strong> ${data.current_band}</p>
          <p><strong>Total Study Time (hours):</strong> ${data.total_time}</p>
          <p><strong>Nationality:</strong> ${data.nationality} (mapped value: ${data.nat_value})</p>
          <p><strong>Native Language:</strong> ${data.native_language} (mapped value: ${data.lang_value})</p>
          <p><strong>Type of Study:</strong> ${data.type_of_study} (mapped value: ${data.study_value})</p>
          <p><strong>English Experience Years:</strong> ${data.english_experience_years}</p>
          <p><strong>Age:</strong> ${data.age}</p>
          <p><strong>Prediction (IELTS Speaking Band):</strong> ${data.prediction}</p>
          <p><strong>Start Date:</strong> ${data.start_date}</p>
          <p><strong>End Date:</strong> ${data.end_date}</p>
        `;

        // Save prediction to the database
        await fetch('/save_prediction', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });
      }
    } catch (error) {
      loader.classList.add('hidden');
      resultContainer.classList.remove('hidden');
      resultDetails.innerHTML = `<p style="color:red;">Error: ${error}</p>`;
    }
  });

  resetBtn.addEventListener('click', function() {
    resultContainer.classList.add('hidden');
    formContainer.classList.remove('hidden');
    form.reset();
  });
});