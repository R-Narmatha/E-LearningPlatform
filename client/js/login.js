const form = document.getElementById('loginForm');
const formMessage = document.getElementById('formMessage');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const passwordToggle = document.querySelector('.password-toggle');
const forgotPasswordLink = document.getElementById('forgotPasswordLink');

if (forgotPasswordLink) {
  forgotPasswordLink.addEventListener('click', (event) => {
    event.preventDefault();
    showMessage('Password reset functionality will be available soon.', 'success');
  });
}

if (passwordToggle) {
  passwordToggle.addEventListener('click', () => {
    const type = passwordInput.type === 'password' ? 'text' : 'password';
    passwordInput.type = type;
    passwordToggle.textContent = type === 'password' ? 'Show' : 'Hide';
    passwordToggle.setAttribute('aria-label', type === 'password' ? 'Show password' : 'Hide password');
  });
}

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

  return isValid;
}

[emailInput, passwordInput].forEach((input) => {
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

  if (!validateForm()) {
    showMessage('Please fix the highlighted errors and try again.', 'error');
    return;
  }

  try {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: emailInput.value.trim(),
        password: passwordInput.value,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      showMessage(data.message || 'Login failed. Please try again.', 'error');
      return;
    }

    if (data.token) {
      sessionStorage.setItem('eduLearnToken', data.token);
      sessionStorage.setItem('eduLearnUser', JSON.stringify(data.user));
    }

    showMessage('Login successful! Redirecting to your dashboard...', 'success');

    setTimeout(() => {
      window.location.href = 'dummy.html';
    }, 1000);
  } catch (error) {
    showMessage('Unable to reach the server. Please try again later.', 'error');
  }
});
