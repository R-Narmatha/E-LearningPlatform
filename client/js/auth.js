document.addEventListener('DOMContentLoaded', async () => {
  const token = sessionStorage.getItem('eduLearnToken');

  if (!token) {
    window.location.href = 'login.html';
    return;
  }

  try {
    const response = await fetch('http://localhost:5000/api/auth/me', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      sessionStorage.removeItem('eduLearnToken');
      sessionStorage.removeItem('eduLearnUser');
      window.location.href = 'login.html';
      return;
    }

    const user = await response.json();
    const welcomeText = document.querySelector('.hero-card h1');

    if (welcomeText && user.name) {
      welcomeText.textContent = `Welcome back, ${user.name}!`;
    }
  } catch (error) {
    sessionStorage.removeItem('eduLearnToken');
    sessionStorage.removeItem('eduLearnUser');
    window.location.href = 'login.html';
  }

  const logoutButton = document.getElementById('logoutBtn');

  if (logoutButton) {
    logoutButton.addEventListener('click', () => {
      sessionStorage.removeItem('eduLearnToken');
      sessionStorage.removeItem('eduLearnUser');
      window.location.href = 'login.html';
    });
  }
});
