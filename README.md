# IELTS Speaking Practice Platform 🎯

Nền tảng luyện thi IELTS Speaking trực tuyến với trải nghiệm thi thật đến 90%, tích hợp công nghệ AI và các tính năng thông minh giúp người học cải thiện kỹ năng nói hiệu quả.

## 🌟 Tính năng nổi bật

### 1. Mô phỏng kỳ thi Computer-based chân thực
- Giao diện giống 90% với phần mềm thi chính thức của IELTS
- Môi trường thi được thiết kế để tạo cảm giác và áp lực giống như thi thật
- Hệ thống tính giờ chính xác cho từng phần thi
- Các câu hỏi được thiết kế theo cấu trúc và độ khó tương đương đề thi thật

### 2. Đa dạng chế độ luyện tập
- **Full Test**: Trải nghiệm toàn bộ bài thi speaking trong 11-14 phút
- **Part 1 Practice**: Tập trung luyện tập các câu hỏi về thông tin cá nhân và chủ đề quen thuộc
- **Part 2 & 3 Practice**: Rèn luyện kỹ năng cue card và trả lời câu hỏi chuyên sâu
- **Custom Practice**: Tự chọn chủ đề và thời gian luyện tập theo nhu cầu

### 3. Tích hợp công nghệ AI
- **Speech-to-Text**: Chuyển đổi câu trả lời của bạn thành văn bản để phân tích
- **Error Detection**: Phát hiện các lỗi phổ biến về:
  - Ngữ pháp cơ bản
  - Từ vựng không phù hợp
  - Độ trôi chảy trong câu trả lời
- **Speaking band Prediction**: Dự đoán band điểm dựa trên (random-forest):
  - Thông tin nhân khẩu học 
  - Điểm IELTS hiện tại
  - Tổng thời gian có thể học 

### 4. Theo dõi tiến độ học tập
- Biểu đồ tiến bộ theo thời gian
- Phân tích chi tiết điểm mạnh, điểm yếu
- Gợi ý chủ đề cần luyện tập thêm
- Lộ trình học tập được cá nhân hóa

## 🚀 Hướng dẫn sử dụng

1. **Đăng ký tài khoản**
   - Tạo tài khoản mới
   - Hoàn thành bài test đánh giá năng lực
   - Nhận lộ trình học tập phù hợp

2. **Chọn chế độ luyện tập**
   - Full Test cho trải nghiệm thi thật
   - Practice Mode cho luyện tập từng phần

3. **Thực hiện bài thi**
   - Làm theo hướng dẫn trên màn hình
   - Trả lời trong thời gian quy định
   - Nhận phản hồi và đánh giá ngay sau khi hoàn thành

4. **Xem kết quả và phân tích**
   - Nhận band điểm dự kiến
   - Xem chi tiết lỗi sai và gợi ý cải thiện
   - Theo dõi tiến độ học tập

## 💡 Lợi ích

- Tiết kiệm thời gian và chi phí luyện thi
- Môi trường luyện tập chân thực
- Nhận phản hồi chi tiết và khách quan
- Theo dõi được sự tiến bộ
- Linh hoạt thời gian luyện tập

## 🛠 Yêu cầu kỹ thuật

- Trình duyệt web hiện đại (Chrome, Firefox, Safari phiên bản mới nhất)
- Microphone hoạt động tốt
- Kết nối internet ổn định
- Không gian yên tĩnh để luyện tập

## 📝 Phản hồi và hỗ trợ

Mọi góp ý và yêu cầu hỗ trợ, vui lòng liên hệ:
- Email: phucanhnguyen0408@gmail.com
- Zalo: 0.3.8.8.9.5.3.8.1.9


## 🔄 Cập nhật thường xuyên

Platform được cập nhật định kỳ với:
- Bộ câu hỏi mới
- Cải thiện độ chính xác của AI
- Tính năng mới theo phản hồi của người dùng
- Tối ưu hóa trải nghiệm người dùng

---

Video demo cho chức năng simulation test: 


[![Tên video](https://img.youtube.com/vi/7qw3OQI7L9g/maxresdefault.jpg)](https://youtu.be/7qw3OQI7L9g)





Video demo cho chức năng pratise-test: 


[![Tên video](https://img.youtube.com/vi/wyd3uTvYV-0/maxresdefault.jpg)](https://youtu.be/wyd3uTvYV-0)


---

# IELTS Speaking Practice Platform mô tả kỹ thuật🎯

## 🛠 Công nghệ sử dụng

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Flask (Python)
- **Database**: MySQL
- **AI Integration**: Speech-to-text, Error detection models

## ⚙️ Cài đặt và Chạy Project

### Yêu cầu hệ thống
- Python 3.8 hoặc cao hơn
- MySQL 5.7 hoặc cao hơn
- Git

### Các bước cài đặt

1. **Clone repository**
```bash
git clone https://github.com/NgPcAnhh/VSR_Website.git
cd VSR_Website
```

2. **Tạo và kích hoạt môi trường ảo (khuyến nghị)**
```bash
python -m venv venv
# Windows
venv\Scripts\activate
# Linux/Mac
source venv/bin/activate
```

3. **Cài đặt các thư viện cần thiết**
```bash
pip install flask
```
//API được viết bằng jupiter notebook, đã có phần cài đặt các thư viện cụ thể

4. **Cấu hình database**
- Tạo database MySQL mới
- Cập nhật thông tin kết nối trong file `database/db.py`

5. **Chạy ứng dụng**
```bash
python app.py
```

6. **Truy cập ứng dụng**
- Mở trình duyệt web và truy cập: `http://localhost:5000`

### Cấu trúc Project
```
VSR_website/                # Root folder of the project
│── API/                    # API-related files (if any)
│── database/               # Database management files
│   │── db.py               # Database connection and setup
│   │── user_queries.py     # User-related database queries
│   └── db_vsr/             # (Possibly a database folder)
│── generatequestion/       # Logic to generate IELTS questions
│── static/                 # Static assets for frontend
│   │── css/                # Stylesheets
│   │── js/                 # JavaScript files
│   │── picture/            # Images
│   └── video/              # Videos
│── templates/              # HTML templates for Flask
│── app.py                  # Main application entry point
└── personalstudyprocesspredicting.joblib  # ML model for study prediction
```

## 🤝 Đóng góp

Mọi đóng góp đều được chào đón! Vui lòng:
1. Fork project
2. Tạo branch mới (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

---

© 2025 IELTS Speaking Practice Platform. All rights reserved.

