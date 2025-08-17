const API_URL = 'http://localhost:3000';

// Token management
function setToken(token) {
  localStorage.setItem('authToken', token);
}

function getToken() {
  return localStorage.getItem('authToken');
}

function removeToken() {
  localStorage.removeItem('authToken');
  localStorage.removeItem('userEmail');
}

function setUserInfo(user) {
  localStorage.setItem('userEmail', user.email);
}

function getUserInfo() {
  return {
    email: localStorage.getItem('userEmail'),
    token: getToken()
  };
}

// Check if user is authenticated
function isAuthenticated() {
  return !!getToken();
}

// Create authenticated fetch request
async function authenticatedFetch(url, options = {}) {
  const token = getToken();
  
  if (!token) {
    throw new Error('No authentication token found');
  }

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    ...options.headers
  };

  const response = await fetch(url, {
    ...options,
    headers
  });

  // If token is invalid, redirect to login
  if (response.status === 401 || response.status === 403) {
    removeToken();
    window.location.href = 'index.html';
    return;
  }

  return response;
}

// Register function
async function register(email, password, confirmPassword) {
  try {
    if (password !== confirmPassword) {
      throw new Error('Passwords do not match');
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }

    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }

    // Store token and user info
    setToken(data.token);
    setUserInfo(data.user);

    return { success: true, message: data.message, user: data.user };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

// Login function
async function login(email, password) {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    // Store token and user info
    setToken(data.token);
    setUserInfo(data.user);

    return { success: true, message: data.message, user: data.user };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

// Logout function
async function logout() {
  try {
    const token = getToken();
    
    if (token) {
      // Notify server about logout
      await fetch(`${API_URL}/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
    }
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    // Always remove local tokens
    removeToken();
    window.location.href = 'index.html';
  }
}

// Verify token validity
async function verifyToken() {
  try {
    const response = await authenticatedFetch(`${API_URL}/verify-token`);
    
    if (!response) return false;
    
    const data = await response.json();
    return data.valid;
  } catch (error) {
    console.error('Token verification failed:', error);
    removeToken();
    return false;
  }
}

// Save note (authenticated)
async function saveNote(content) {
  try {
    const response = await authenticatedFetch(`${API_URL}/note`, {
      method: 'POST',
      body: JSON.stringify({ content })
    });

    if (!response) return { success: false, message: 'Authentication failed' };

    const data = await response.json();
    return { success: response.ok, message: data.message };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

// Load note (authenticated)
async function loadNote() {
  try {
    const response = await authenticatedFetch(`${API_URL}/note`);
    
    if (!response) return { success: false, content: '' };

    const data = await response.json();
    return { success: true, content: data.content || '' };
  } catch (error) {
    console.error('Load note error:', error);
    return { success: false, content: '' };
  }
}

// AI functions (authenticated)
async function improveText(text, improvementType = 'general') {
  try {
    const response = await authenticatedFetch(`${API_URL}/ai/improve`, {
      method: 'POST',
      body: JSON.stringify({ text, improvementType })
    });

    if (!response) return { success: false, message: 'Authentication failed' };

    const data = await response.json();
    return { success: response.ok, data };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

async function translateText(text, targetLanguage = 'Spanish') {
  try {
    const response = await authenticatedFetch(`${API_URL}/ai/translate`, {
      method: 'POST',
      body: JSON.stringify({ text, targetLanguage })
    });

    if (!response) return { success: false, message: 'Authentication failed' };

    const data = await response.json();
    return { success: response.ok, data };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

async function explainText(text, analysisType = 'general') {
  try {
    const response = await authenticatedFetch(`${API_URL}/ai/explain`, {
      method: 'POST',
      body: JSON.stringify({ text, analysisType })
    });

    if (!response) return { success: false, message: 'Authentication failed' };

    const data = await response.json();
    return { success: response.ok, data };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

// Initialize authentication check on page load
document.addEventListener('DOMContentLoaded', function() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  
  // Pages that require authentication
  const protectedPages = ['editor.html'];
  
  // Pages that should redirect if already authenticated
  const authPages = ['index.html', 'register.html'];
  
  if (protectedPages.includes(currentPage)) {
    if (!isAuthenticated()) {
      window.location.href = 'index.html';
      return;
    }
    // Verify token is still valid
    verifyToken().then(valid => {
      if (!valid) {
        window.location.href = 'index.html';
      }
    });
  } else if (authPages.includes(currentPage) && isAuthenticated()) {
    // If user is already authenticated and on login/register page, redirect to editor
    window.location.href = 'editor.html';
  }
});
