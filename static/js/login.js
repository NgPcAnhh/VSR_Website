document.addEventListener('DOMContentLoaded', function() {
    const feedbackBtn = document.getElementById('feedbackBtn');
    const feedbackModal = document.getElementById('feedbackModal');
    const closeBtn = document.querySelector('.close-btn');
    const feedbackForm = document.getElementById('feedbackForm');

    // Open feedback modal
    feedbackBtn.addEventListener('click', function() {
        feedbackModal.style.display = 'block';
    });

    // Close feedback modal
    closeBtn.addEventListener('click', function() {
        feedbackModal.style.display = 'none';
    });

    // Close feedback modal when clicking outside of the modal
    window.addEventListener('click', function(event) {
        if (event.target == feedbackModal) {
            feedbackModal.style.display = 'none';
        }
    });

    // Handle feedback form submission
    feedbackForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const userEmail = document.getElementById('userEmail').value;
        const feedbackText = document.getElementById('feedbackText').value;

        fetch('/submit_feedback', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userEmail, feedbackText })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("Feedback submitted successfully!");
                feedbackForm.reset();
                feedbackModal.style.display = 'none';
            } else {
                alert("Feedback submission failed: " + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });
});


// tạo tài khoản
function showCreateAccount() {
    document.getElementById('loginForm').classList.add('slide-out');
    document.querySelector('.vsr-logo-container').classList.add('logo-hidden');
    setTimeout(() => {
        document.getElementById('createAccountForm').classList.add('slide-in');
    }, 100);
    document.getElementById('forgotPasswordForm').classList.remove('slide-in');
}

document.addEventListener('DOMContentLoaded', function() {
    const createAccountForm = document.querySelector('.create-account-container form');

    createAccountForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const login_name = document.getElementById('login_name').value;
        const full_name = document.getElementById('full_name').value;
        const phone_number = document.getElementById('phone_number').value;
        const password = document.getElementById('new_password').value;

        fetch('/create_account', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ login_name, full_name, phone_number, password })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("Account created successfully!");
                showLogin();
            } else {
                alert("Account creation failed: " + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });
});





// chức năng quên mật khẩu
function showForgotPassword() {
    document.getElementById('loginForm').classList.add('slide-out');
    document.querySelector('.vsr-logo-container').classList.add('logo-hidden');
    document.getElementById('forgotPasswordForm').classList.add('slide-in');
    document.getElementById('createAccountForm').classList.remove('slide-in');
}

document.addEventListener('DOMContentLoaded', function() {
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');

    forgotPasswordForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const phone_number = document.getElementById('reset_phone').value;
        const new_password = document.getElementById('reset_password').value;
        const confirm_password = document.getElementById('reset_confirm').value;

        if (new_password !== confirm_password) {
            alert("Passwords do not match!");
            return;
        }

        fetch('/reset_password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ phone_number, new_password })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("Password reset successfully!");
                showLogin();
            } else {
                alert("Password reset failed: " + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });
});





function showLogin() {
    document.getElementById('createAccountForm').classList.remove('slide-in');
    document.getElementById('forgotPasswordForm').classList.remove('slide-in');
    setTimeout(() => {
        document.getElementById('loginForm').classList.remove('slide-out');
        document.querySelector('.vsr-logo-container').classList.remove('logo-hidden');
    }, 100);
}

document.addEventListener('DOMContentLoaded', function() {
    const backButtons = document.querySelectorAll('.back-to-login');
    backButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            showLogin();
        });
    });
});



// chức năng login
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.querySelector('.login-container form');

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                window.location.href = '/loader';  // Use relative path
            } else {
                alert("Login failed: " + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });
});


