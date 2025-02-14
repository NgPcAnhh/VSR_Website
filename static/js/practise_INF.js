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
    document.querySelector('.taskbar'),
    document.querySelector('.next-question-btn'),
    ...document.querySelectorAll('.control-btn')
  ];

  elements.forEach(element => element?.classList.toggle('dark-mode'));
}

// --------------------------------------------------------------------------------
// xử lý phàn thi luyện tập

