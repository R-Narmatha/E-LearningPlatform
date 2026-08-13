const form = document.getElementById('forgotPasswordForm');
const formMessage = document.getElementById('formMessage');
const resetEmailInput = document.getElementById('resetEmail');
const newPasswordInput = document.getElementById('newPassword');
const confirmNewPasswordInput = document.getElementById('confirmNewPassword');
const toggleButtons = document.querySelectorAll('.password-toggle');

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

  if (!resetEmailInput.value.trim()) {
    setError(resetEmailInput, 'Email is required.');
    isValid = false;
  } else if (!isValidEmail(resetEmailInput.value.trim())) {
    setError(resetEmailInput, 'Please enter a valid email address.');
    isValid = false;
  } else {
    clearError(resetEmailInput);
  }

  if (!newPasswordInput.value) {
    setError(newPasswordInput, 'New password is required.');
    isValid = false;
  } else if (newPasswordInput.value.length < 8) {
    setError(newPasswordInput, 'Password must be at least 8 characters long.');
    isValid = false;
  } else {
    clearError(newPasswordInput);
  }

  if (!confirmNewPasswordInput.value) {
    setError(confirmNewPasswordInput, 'Please confirm your new password.');
    isValid = false;
  } else if (confirmNewPasswordInput.value !== newPasswordInput.value) {
    setError(confirmNewPasswordInput, 'Passwords do not match.');
    isValid = false;
  } else {
    clearError(confirmNewPasswordInput);
  }

  return isValid;
}

[resetEmailInput, newPasswordInput, confirmNewPasswordInput].forEach((input) => {
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

toggleButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const targetId = button.dataset.target;
    const targetInput = document.getElementById(targetId);

    if (!targetInput) return;

    const shouldShow = targetInput.type === 'password';
    targetInput.type = shouldShow ? 'text' : 'password';
    button.textContent = shouldShow ? 'Hide' : 'Show';
    button.setAttribute('aria-label', shouldShow ? 'Hide password' : 'Show password');
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
    const response = await fetch('http://localhost:5000/api/auth/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: resetEmailInput.value.trim(),
        newPassword: newPasswordInput.value,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      showMessage(data.message || 'Password reset failed. Please try again.', 'error');
      return;
    }

    showMessage('Password reset successful! Redirecting to login...', 'success');
    form.reset();

    setTimeout(() => {
      window.location.href = 'login.html';
    }, 1000);
  } catch (error) {
    showMessage('Unable to reach the server. Please try again later.', 'error');
  }
});
