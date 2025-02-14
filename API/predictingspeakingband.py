import joblib
import pandas as pd

# Định nghĩa các dictionary map
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

# Load model
print("Loading model...")
model = joblib.load("personalstudyprocesspredicting.joblib")

# Nhập current band
while True:
    try:
        current_band = float(input("Nhập current band: "))
        break
    except ValueError:
        print("Giá trị không hợp lệ, vui lòng nhập số.")

# Nhập và tính total_time
while True:
    try:
        avg_hours = float(input("Nhập average study hours per day: "))
        total_days = float(input("Nhập total days: "))
        total_time = avg_hours * total_days
        break
    except ValueError:
        print("Giá trị không hợp lệ, vui lòng nhập số.")

# Nhập và chuyển đổi nationality
while True:
    nat = input(f"Nhập nationality {list(nationality_map.keys())}: ")
    if nat in nationality_map:
        nat_value = nationality_map[nat]
        break
    print("Nationality không hợp lệ, vui lòng nhập lại.")

# Nhập và chuyển đổi native language
while True:
    lang = input(f"Nhập native language {list(native_language_map.keys())}: ")
    if lang in native_language_map:
        lang_value = native_language_map[lang]
        break
    print("Native language không hợp lệ, vui lòng nhập lại.")

# Nhập và chuyển đổi type of study
while True:
    study_type = input(f"Nhập type of study {list(type_of_study_map.keys())}: ")
    if study_type in type_of_study_map:
        study_value = type_of_study_map[study_type]
        break
    print("Type of study không hợp lệ, vui lòng nhập lại.")

# Nhập english experience years
while True:
    try:
        eng_exp = float(input("Nhập số năm kinh nghiệm tiếng Anh: "))
        break
    except ValueError:
        print("Giá trị không hợp lệ, vui lòng nhập số.")

# Nhập age
while True:
    try:
        age = float(input("Nhập tuổi: "))
        break
    except ValueError:
        print("Giá trị không hợp lệ, vui lòng nhập số.")

# In ra bộ dữ liệu đã chuyển đổi
print("\nBộ dữ liệu sau khi chuyển đổi:")
print(f"Current band: {current_band}")
print(f"Total time (hours): {total_time} (từ {avg_hours} giờ/ngày × {total_days} ngày)")
print(f"Nationality: {nat} -> average speaking band: {nat_value}")
print(f"Native language: {lang} -> average speaking band: {lang_value}")
print(f"Type of study: {study_type} -> {study_value}")
print(f"English experience years: {eng_exp}")
print(f"Age: {age}")

# Tạo DataFrame features có cột tên giống với model yêu cầu:
feature_columns = [
    'current band',
    'total_time',
    'nationality',
    'native_language',
    'type_of_study',
    'english_experience_years',
    'age'
]

data = {
    "current band": [current_band],
    "total_time": [total_time],
    "nationality": [nat_value],
    "native_language": [lang_value],
    "type_of_study": [study_value],
    "english_experience_years": [eng_exp],
    "age": [age]
}

features = pd.DataFrame(data, columns=feature_columns)

# Dự đoán
prediction = model.predict(features)
print("\nDự đoán targeted band:", prediction[0])
