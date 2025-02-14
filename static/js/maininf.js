// Language toggle
    const languageToggle = document.getElementById('languageToggle');
    let isVietnamese = true;

    const translations = {
        vi: {
            welcome: 'Xin chào, học viên!',
            subtitle: 'Hãy bắt đầu luyện tập tiếng Anh nào',
            startChat: 'Bắt đầu',
            chatTitle: 'Bài thi mô phỏng',
            chatDesc: 'Thi IELTS Speaking với bot, bộ câu hỏi ngẫu nhiên mô phỏng 90% kì thi thật',
            startSpeaking: 'Thử ngay',
            speakingTitle: 'Luyện nói',
            speakingDesc: 'Phát triển kỹ năng phát âm và nói',
            historyTitle: 'Lịch sử ôn luyện',
            modalTitle: 'Lịch sử chi tiết',
            score: 'Điểm',
            duration: 'Thời gian',
            status: 'Trạng thái',
            part1Title: 'Phần 1',
            part1Desc: 'Luyện tập phần 1',
            part23Title: 'Phần 2+3',
            part23Desc: 'Luyện tập phần 2 và 3',
            fullTitle: 'Bài thi đầy đủ',
            fullDesc: 'Luyện tập toàn bộ',
            confirmTitle: 'Bạn có chắc chắn muốn bắt đầu bài thi?',
            confirmDesc: 'Bài thi sẽ kéo dài khoảng 15 phút và không thể tạm dừng',
            confirmYes: 'Bắt đầu thi',
            confirmNo: 'Quay lại',
            converterTitle: 'Chuyển đổi',
            converterDesc: 'Chuyển đổi các định dạng file ghi âm khác nhau về dạng WAV để thực hiện chuyển đổi speech-to-text.',
            converterBtn: 'Đi đến Chuyển đổi',
            speech2textTitle: 'Chuyển đổi giọng nói thành văn bản',
            speech2textDesc: 'Chuyển đổi đoạn ghi âm thành văn bản.',
            speech2textBtn: 'Đi đến Speech2Text'
        },
        en: {
            welcome: 'Hello, student!',
            subtitle: "Let's start practicing English",
            startChat: 'Start',
            chatTitle: 'Simulated test',
            chatDesc: 'Take an IELTS Speaking test with the bot, featuring a randomly generated set of questions simulating 90% of the real exam.',
            startSpeaking: 'Try now',
            speakingTitle: 'Speaking Practice',
            speakingDesc: 'Develop pronunciation and speaking skills',
            historyTitle: 'Practice History',
            modalTitle: 'Detailed History',
            score: 'Score',
            duration: 'Duration',
            status: 'Status',
            part1Title: 'Part 1',
            part1Desc: 'Practice Part 1',
            part23Title: 'Part 2+3',
            part23Desc: 'Practice Part 2 and 3',
            fullTitle: 'Full Test',
            fullDesc: 'Practice full test',
            confirmTitle: 'Are you sure you want to start the test?',
            confirmDesc: 'The test will take about 15 minutes and cannot be paused',
            confirmYes: 'Start Test',
            confirmNo: 'Go Back',
            converterTitle: 'Converter',
            converterDesc: 'Convert various audio file formats to WAV for speech-to-text conversion.',
            converterBtn: 'Go to Converter',
            speech2textTitle: 'Speech2Text',
            speech2textDesc: 'Convert audio recordings to text.',
            speech2textBtn: 'Go to Speech2Text'
        }
    };

    languageToggle.addEventListener('click', () => {
        isVietnamese = !isVietnamese;
        const lang = isVietnamese ? 'vi' : 'en';
        document.getElementById('welcome-title').textContent = translations[lang].welcome;
        document.getElementById('welcome-subtitle').textContent = translations[lang].subtitle;
        document.getElementById('start-chat').textContent = translations[lang].startChat;
        document.getElementById('chat-title').textContent = translations[lang].chatTitle;
        document.getElementById('chat-desc').textContent = translations[lang].chatDesc;
        document.getElementById('start-speaking').textContent = translations[lang].startSpeaking;
        document.getElementById('speaking-title').textContent = translations[lang].speakingTitle;
        document.getElementById('speaking-desc').textContent = translations[lang].speakingDesc;
        document.getElementById('history-title').textContent = translations[lang].historyTitle;
        document.getElementById('confirm-title').textContent = translations[lang].confirmTitle;
        document.getElementById('confirm-desc').textContent = translations[lang].confirmDesc;

        // Update bottom cards
        document.getElementById('converter-card').querySelector('h2').textContent = translations[lang].converterTitle;
        document.getElementById('converter-card').querySelector('p').textContent = translations[lang].converterDesc;
        document.getElementById('converter-card').querySelector('a').textContent = translations[lang].converterBtn;
        document.getElementById('speech2text-card').querySelector('h2').textContent = translations[lang].speech2textTitle;
        document.getElementById('speech2text-card').querySelector('p').textContent = translations[lang].speech2textDesc;
        document.getElementById('speech2text-card').querySelector('a').textContent = translations[lang].speech2textBtn;
    });

    // Theme toggle
    const themeToggle = document.getElementById('themeToggle');
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        themeToggle.textContent = document.body.classList.contains('dark-mode') ? '🌙' : '☀️';
    });

    // Profile dropdown
    const profileIcon = document.getElementById('profileIcon');
    const profileDropdown = document.getElementById('profileDropdown');

    profileIcon.addEventListener('click', (e) => {
        e.stopPropagation();
        profileDropdown.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
        if (!profileDropdown.contains(e.target)) {
            profileDropdown.classList.remove('active');
        }
    });

    // Thêm event listener cho history section
    document.querySelector('.history-section').addEventListener('click', function() {
        openHistoryModal();
    });

    function openHistoryModal() {
        const modal = document.getElementById('historyModal');
        modal.style.display = 'flex';
        // Cập nhật ngôn ngữ cho modal
        updateModalLanguage();
    }

    function closeHistoryModal() {
        const modal = document.getElementById('historyModal');
        modal.style.display = 'none';
    }

    function updateModalLanguage() {
        const lang = isVietnamese ? 'vi' : 'en';
        document.getElementById('modalHistoryTitle').textContent = translations[lang].modalTitle;
        // Cập nhật các header của bảng nếu cần
    }

    // Đóng modal khi click bên ngoài
    window.onclick = function(event) {
        const modal = document.getElementById('historyModal');
        if (event.target == modal) {
            closeHistoryModal();
        }
    }

    function flipCard(card) {
        card.classList.toggle('flipped');
    }

    function startPractice(type, event) {
        event.stopPropagation(); // Ngăn không cho sự kiện click lan tỏa lên thẻ cha
        // Xử lý logic bắt đầu luyện tập tương ứng với type
        switch(type) {
            case 'part1':
                console.log('Starting Part 1 practice');
                break;
            case 'part23':
                console.log('Starting Part 2+3 practice');
                break;
            case 'full':
                console.log('Starting Full Test practice');
                break;
        }
    }

    function startTest(event) {
        event.stopPropagation();
        // Xử lý logic bắt đầu bài thi
        console.log('Starting simulated test');
    }

    function cancelTest(event) {
        event.stopPropagation();
        // Lật lại thẻ về mặt trước
        const card = event.target.closest('.practice-card');
        card.classList.remove('flipped');
    }

    // logout
    window.addEventListener('beforeunload', function() {
        fetch('/logout', { method: 'GET' });
    });

    // hiển thị history
    function fetchHistoryData() {
        fetch('/get_history')
            .then(response => response.json())
            .then(data => {
                const tbody = document.getElementById('modalHistoryBody');
                tbody.innerHTML = ''; // Clear existing rows
                data.forEach(row => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${row.id_test}</td>
                        <td>${row.id}</td>
                        <td>${row.time}</td>
                        <td>${row.type}</td>
                    `;
                    tbody.appendChild(tr);
                });
            })
            .catch(error => console.error('Error fetching history data:', error));
    }

    // Call fetchHistoryData when the modal is opened
    document.querySelector('.history-section').addEventListener('click', function() {
        openHistoryModal();
        fetchHistoryData();
    });