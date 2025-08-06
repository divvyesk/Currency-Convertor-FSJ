// Toggle between Login and Sign Up forms
document.getElementById('login-btn').addEventListener('click', function() {
    document.getElementById('login-form').style.display = 'block';
    document.getElementById('signup-form').style.display = 'none';
    document.getElementById('login-btn').classList.add('active');
    document.getElementById('signup-btn').classList.remove('active');
});

document.getElementById('signup-btn').addEventListener('click', function() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('signup-form').style.display = 'block';
    document.getElementById('signup-btn').classList.add('active');
    document.getElementById('login-btn').classList.remove('active');
});

// Toggle password visibility for Login form
document.getElementById('toggle-login-password').addEventListener('click', function() {
    const passwordInput = document.getElementById('login-password');
    const passwordType = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', passwordType);
});

// Toggle password visibility for Sign Up form
document.getElementById('toggle-signup-password').addEventListener('click', function() {
    const passwordInput = document.getElementById('signup-password');
    const passwordType = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', passwordType);
});

// Toggle password visibility for Confirm Password field
document.getElementById('toggle-confirm-password').addEventListener('click', function() {
    const confirmPasswordInput = document.getElementById('confirm-password');
    const passwordType = confirmPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    confirmPasswordInput.setAttribute('type', passwordType);
});

// Password strength detector for Sign Up form
const passwordInput = document.getElementById('signup-password');
const passwordStrengthDisplay = document.getElementById('password-strength');

passwordInput.addEventListener('input', function() {
    const password = passwordInput.value;
    const strength = checkPasswordStrength(password);
    passwordStrengthDisplay.textContent = strength;
});

// Check password strength
function checkPasswordStrength(password) {
    let strength = 'Weak';
    const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (strongRegex.test(password)) {
        strength = 'Strong';
    } else if (password.length >= 6) {
        strength = 'Medium';
    }

    return `Password Strength: ${strength}`;
}

// Email format validation (Regex)
function isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}

// Handle Login form submission
function handleLoginSubmit(event) {
    event.preventDefault();  // Prevent form submission

    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    // Check email validity
    if (!isValidEmail(username)) {
        alert("Please enter a valid email address (e.g., example@gmail.com).");
        return;  // Prevent further form submission
    }

    // Check if password is strong enough
    if (password.length < 8) {
        alert("Password is too weak. It should be at least 8 characters long.");
        return;
    }

    // If validation passes, proceed with the login (you can replace this with actual logic)
    alert(`Logged in as: ${username}`);
}

// Handle Sign Up form submission
function handleSignUpSubmit(event) {
    event.preventDefault();  // Prevent form submission

    const name = document.getElementById('signup-name').value;
    const username = document.getElementById('signup-username').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    // Check email validity
    if (!isValidEmail(username)) {
        alert("Please enter a valid email address (e.g., example@gmail.com).");
        return;  // Prevent further form submission
    }

    // Check if password is strong enough
    if (password.length < 8 || !checkPasswordStrength(password).includes('Strong')) {
        alert("Password is too weak. It should be at least 8 characters long and include uppercase letters, numbers, and special characters.");
        return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
    }

    // If validation passes, proceed with the sign-up (you can replace this with actual logic)
    alert(`Signed up successfully as: ${name}`);
}

// Attach submit event listeners to forms
document.getElementById('login-form').addEventListener('submit', handleLoginSubmit);
document.getElementById('signup-form').addEventListener('submit', handleSignUpSubmit);
