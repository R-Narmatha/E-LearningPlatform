const form = document.getElementById('signupForm');
const formMessage = document.getElementById('formMessage');

const fullNameInput = document.getElementById('fullName');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');

function setError(input, message) {
  const errorElement = document.querySelector(`[data-error-for="${input.id}"]`);

  input.classList.add('error');
  errorElement.textContent = message;
}

function clearError(input) {
  const errorElement = document.querySelector(`[data-error-for="${input.id}"]`);

  input.classList.remove('error');
  errorElement.textContent = '';
}

function showMessage(message, type) {
  formMessage.textContent = message;
  formMessage.className = `form-message visible ${type}`;
}

function isValidEmail(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

function validateForm() {
  let isValid = true;

  if (!fullNameInput.value.trim()) {
    setError(fullNameInput, 'Full name is required.');
    isValid = false;
  } else {
    clearError(fullNameInput);
  }

  if (!emailInput.value.trim()) {
    setError(emailInput, 'Email is required.');
    isValid = false;
  } else if (!isValidEmail(emailInput.value.trim())) {
    setError(emailInput, 'Please enter a valid email address.');
    isValid = false;
  } else {
    clearError(emailInput);
  }

  if (!passwordInput.value) {
    setError(passwordInput, 'Password is required.');
    isValid = false;
  } else if (passwordInput.value.length < 8) {
    setError(passwordInput, 'Password must be at least 8 characters long.');
    isValid = false;
  } else {
    clearError(passwordInput);
  }

  if (!confirmPasswordInput.value) {
    setError(confirmPasswordInput, 'Please confirm your password.');
    isValid = false;
  } else if (confirmPasswordInput.value !== passwordInput.value) {
    setError(confirmPasswordInput, 'Passwords do not match.');
    isValid = false;
  } else {
    clearError(confirmPasswordInput);
  }

  return isValid;
}

[fullNameInput, emailInput, passwordInput, confirmPasswordInput].forEach((input) => {
  input.addEventListener('input', () => {
    if (input.classList.contains('error')) {
      clearError(input);
    }

    if (formMessage.classList.contains('visible')) {
      formMessage.className = 'form-message';
      formMessage.textContent = '';
    }
  });
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  formMessage.className = 'form-message';
  formMessage.textContent = '';

  const isValid = validateForm();

  if (!isValid) {
    showMessage('Please fix the highlighted errors and try again.', 'error');
    return;
  }

  try {
    const response = await fetch('http://localhost:5000/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: fullNameInput.value.trim(),
        email: emailInput.value.trim(),
        password: passwordInput.value,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      showMessage(data.message || 'Signup failed. Please try again.', 'error');
      return;
    }

    showMessage('Sign up successful! Redirecting to login...', 'success');
    form.reset();

    setTimeout(() => {
      window.location.href = 'login.html';
    }, 1000);
  } catch (error) {
    showMessage('Unable to reach the server. Please try again later.', 'error');
  }
});
