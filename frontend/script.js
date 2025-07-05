const API_URL = 'http://localhost:3000';

async function register() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const res = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();
  document.getElementById('message').innerText = data.message;
}

async function login() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const res = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();
  document.getElementById('message').innerText = data.message;

  if (data.message === 'Login successful') {
    // ✅ Save email or token (optional) and go to the editor page
    localStorage.setItem('email', email);
    window.location.href = 'editor.html';  // next step: create this page
  }
}
