from flask import Flask, request, jsonify, render_template, session
import database.user_queries as user_queries
import os
import time
import joblib
from datetime import datetime, timedelta
import pandas as pd

# ________________________________________________________________________________
app = Flask(__name__)
app.secret_key = os.urandom(24)  # Set the secret key to a random 24-byte string


#________________________________________________________________________________
@app.route('/')
def index():
    return render_template('login.html')

@app.route('/speech2text_INF')
def speech2text_INF():
    return render_template('speech2text_INF.html')

@app.route('/loader')
def loader():
    return render_template('loader.html')

@app.route('/MainInterface')
def main_interface():
    user_id = session.get('user_id', 'Unknown')  # Get user ID from session
    return render_template('MainInterface.html', user_id=user_id)

@app.route('/logout')
def logout():
    session.pop('user_id', None)  # Remove user ID from session
    return render_template('login.html')  # Redirect to login page

@app.route('/timer')
def timer():
    return render_template('timer.html')

@app.route('/simulatedtest')
def simulatedtest():
    return render_template('simulatedtest.html')

@app.route('/endTest')
def endTest():
    return render_template('endTest.html')

@app.route('/prepare')
def prepare():
    return render_template('prepare.html')

@app.route('/converter')
def converter():
    return render_template('converter.html')

@app.route('/loader2')
def loader2():
    return render_template('loader2.html')
# ________________________________________________________________________________

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    user = user_queries.get_user_by_login_name(username)
    if user and user[0]['password'] == password:
        session['user_id'] = user[0]['id']  # Store user ID in session
        return jsonify({'success': True})
    else:
        return jsonify({'success': False, 'message': 'Invalid username or password'})

@app.route('/create_account', methods=['POST'])
def create_account():
    data = request.get_json()
    login_name = data.get('login_name')
    full_name = data.get('full_name')
    phone_number = data.get('phone_number')
    password = data.get('password')

    query = """INSERT INTO user (login_name, password, full_name, phone_number)VALUES (%s, %s, %s, %s)"""
    params = (login_name, password, full_name, phone_number)

    result = user_queries.execute_query(query, params)
    if result is not None:
        return jsonify({'success': True})
    else:
        return jsonify({'success': False, 'message': 'Failed to create account'})

@app.route('/reset_password', methods=['POST'])
def reset_password():
    data = request.get_json()
    phone_number = data.get('phone_number')
    new_password = data.get('new_password')

    user = user_queries.get_user_by_phone_number(phone_number)
    if user:
        query = "UPDATE user SET password = %s WHERE phone_number = %s"
        params = (new_password, phone_number)
        result = user_queries.execute_query(query, params)
        if result is not None:
            return jsonify({'success': True})
        else:
            return jsonify({'success': False, 'message': 'Failed to reset password'})
    else:
        return jsonify({'success': False, 'message': 'Phone number not found'})


@app.route('/submit_feedback', methods=['POST'])
def submit_feedback():
    data = request.get_json()
    user_email = data.get('userEmail')
    feedback_text = data.get('feedbackText')
    timestamp = time.strftime('%Y-%m-%d %H:%M:%S')

    max_id = user_queries.get_max_feedback_id()
    new_id = max_id + 1

    query = "INSERT INTO feedbacks (id, gmail, feedbacks, time) VALUES (%s, %s, %s, %s)"
    params = (new_id, user_email, feedback_text, timestamp)

    result = user_queries.execute_query(query, params)
    if result is not None:
        return jsonify({'success': True})
    else:
        return jsonify({'success': False, 'message': 'Failed to submit feedback'})


@app.route('/get_history', methods=['GET'])
def get_history():
    query = "SELECT id_test, id, time, type FROM history"
    history_data = user_queries.execute_query(query, ())
    return jsonify(history_data)


@app.route('/generate_questions', methods=['GET'])
def generate_questions():
    from VSR_website.generatequestion import randomquestionfull
    # Reset biến global kq
    randomquestionfull.kq = []
    # Gọi hàm main để lấy câu hỏi mới
    questions = randomquestionfull.main()
    return jsonify(questions)


@app.route('/question4p1', methods=['GET'])
def question4p1():
    from VSR_website.generatequestion import questionp1
    questions = questionp1.generate_part1_questions()
    return jsonify(questions)

@app.route('/practise4p1')
def practisep1():
    return render_template('practise4p1.html')


@app.route('/question4p23', methods=['GET'])
def question4p23():
    from VSR_website.generatequestion import questionp23
    questions = questionp23.main()
    return jsonify(questions)

@app.route('/practise4p23')
def practisep23():
    return render_template('practise4p23.html')

@app.route('/practisefulltest')
def practisefulltest():
    return render_template('practisefulltest.html')

@app.route('/predicting')
def predicting():
    return render_template('predicting.html')
# ________________________________________________________________________________
# lịch sử ôn luyện

# simulated test
@app.route('/save_completion_time', methods = ['POST'])
def save_completion_time():
    data = request.get_json()
    user_id = session.get('user_id', 'Unknown')
    completion_time = data.get('completion_time')
    timestamp = time.strftime('%Y-%m-%d %H:%M:%S')
    id_test = f"{user_id}{completion_time.replace('-', '').replace(':', '').replace(' ', '')}"
    type = data.get('type')

    query = "INSERT INTO history (id_test, id, time,type) VALUES (%s, %s, %s, %s)"
    params = (id_test, user_id, timestamp, type)

    result = user_queries.execute_query(query, params)
    if result is not None:
        return jsonify({'success': True})
    else:
        return jsonify({'success': False, 'message': 'Failed to save completion time'})

# ________________________________________________________________________________
model = joblib.load("personalstudyprocesspredicting.joblib")

# Define mapping dictionaries
nationality_map = {
    'Vietnam': 5.7,
    'China': 5.5,
    'Korea': 5.9,
    'Japan': 5.5,
    'Thailand': 5.9,
    'Indonesia': 6.4,
    'Malaysia': 6.8,
    'India': 6.2,
    'Cambodia': 6.1,
    'Singapore': 7.1
}

native_language_map = {
    "Vietnamese": 5.7,
    "Chinese": 5.6,
    "Korean": 5.9,
    "Japanese": 5.5,
    "Thai": 5.9,
    "Indonesian": 6.4,
    "Malay": 6.8,
    "Hindi": 6.5,
    "Khmer": 6.1,
    "Singaporean": 7.1
}

type_of_study_map = {
    'self-study': -1,
    'school': 0,
    'group': 1
}

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    try:
        current_band = float(data['current_band'])
        avg_hours = float(data['avg_hours'])
        total_days = float(data['total_days'])
        total_time = avg_hours * total_days

        nat = data['nationality']
        nat_value = nationality_map.get(nat)

        lang = data['native_language']
        lang_value = native_language_map.get(lang)

        study_type = data['type_of_study']
        study_value = type_of_study_map.get(study_type)

        eng_exp = float(data['english_experience_years'])
        age = float(data['age'])

        start_date_str = data.get('start_date')
        if start_date_str:
            start_date = datetime.strptime(start_date_str, '%Y-%m-%d')
            end_date = start_date + timedelta(days=int(total_days))
            end_date_str = end_date.strftime('%Y-%m-%d')
        else:
            end_date_str = ''

        feature_columns = [
            'current band',
            'total_time',
            'nationality',
            'native_language',
            'type_of_study',
            'english_experience_years',
            'age'
        ]
        input_data = {
            "current band": [current_band],
            "total_time": [total_time],
            "nationality": [nat_value],
            "native_language": [lang_value],
            "type_of_study": [study_value],
            "english_experience_years": [eng_exp],
            "age": [age]
        }
        features = pd.DataFrame(input_data, columns=feature_columns)
        prediction = model.predict(features)[0]

        result = {
            "current_band": current_band,
            "total_time": total_time,
            "nationality": nat,
            "nat_value": nat_value,
            "native_language": lang,
            "lang_value": lang_value,
            "type_of_study": study_type,
            "study_value": study_value,
            "english_experience_years": eng_exp,
            "age": age,
            "prediction": prediction,
            "start_date": start_date_str,
            "end_date": end_date_str
        }

        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 400



@app.route('/save_prediction', methods=['POST'])
def save_prediction():
    data = request.get_json()
    try:
        current_band = data['current_band']
        total_time = data['total_time']
        nat = data['nationality']
        lang = data['native_language']
        study_type = data['type_of_study']
        eng_exp = data['english_experience_years']
        age = data['age']
        prediction = data['prediction']

        query = """
        INSERT INTO student_info (current_band, total_time, nationality, native_language, type_of_study, english_experience_years, age, target_band)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """
        params = (current_band, total_time, nat, lang, study_type, eng_exp, age, prediction)
        user_queries.execute_query(query, params)

        return jsonify({"success": True})
    except Exception as e:
        return jsonify({"error": str(e)}), 400
# ________________________________________________________________________________


if __name__ == '__main__':
    print(os.listdir('templates'))  # Debug print statement
    app.run(debug=True)