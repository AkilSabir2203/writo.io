const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();
const User = require('./models/User');

const Note = mongoose.model('Note', {
  email: String,
  content: String
}); 

const app = express();
app.use(cors());
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';

// JWT Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

// Register
app.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashed });
    await user.save();

    // Generate JWT token
    const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });

    res.json({ 
      message: 'Registration successful',
      token,
      user: { id: user._id, email: user.email }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// Login
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });

    res.json({ 
      message: 'Login successful',
      token,
      user: { id: user._id, email: user.email }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Logout (client-side token removal, but we can track it server-side if needed)
app.post('/logout', authenticateToken, (req, res) => {
  // In a more complex setup, you might want to maintain a blacklist of tokens
  // For now, we'll just acknowledge the logout
  res.json({ message: 'Logout successful' });
});

// Verify token endpoint
app.get('/verify-token', authenticateToken, (req, res) => {
  res.json({ 
    valid: true, 
    user: { id: req.user.userId, email: req.user.email } 
  });
});

// Save or update a note (now protected)
app.post('/note', authenticateToken, async (req, res) => {
  try {
    const { content } = req.body;
    const email = req.user.email;
    
    const existing = await Note.findOne({ email });

    if (existing) {
      existing.content = content;
      await existing.save();
    } else {
      await new Note({ email, content }).save();
    }

    res.json({ message: 'Note saved successfully' });
  } catch (error) {
    console.error('Note save error:', error);
    res.status(500).json({ message: 'Server error while saving note' });
  }
});

// Get a user's note (now protected)
app.get('/note', authenticateToken, async (req, res) => {
  try {
    const email = req.user.email;
    const note = await Note.findOne({ email });
    res.json(note || { content: '' });
  } catch (error) {
    console.error('Note fetch error:', error);
    res.status(500).json({ message: 'Server error while fetching note' });
  }
});

// ========== GEMINI AI ENDPOINTS (now protected) ==========


// Improve/rewrite text
app.post('/ai/improve', authenticateToken, async (req, res) => {
  try {
    const { text, improvementType = 'general' } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    let prompt;
    switch (improvementType) {
      case 'grammar':
        prompt = `Please correct the grammar and spelling in the following text while maintaining its original meaning and tone:\n\n"${text}"`;
        break;
      case 'clarity':
        prompt = `Please rewrite the following text to make it clearer and more concise while maintaining its original meaning:\n\n"${text}"`;
        break;
      case 'professional':
        prompt = `Please rewrite the following text in a more professional tone:\n\n"${text}"`;
        break;
      case 'casual':
        prompt = `Please rewrite the following text in a more casual, friendly tone:\n\n"${text}"`;
        break;
      default:
        prompt = `Please improve the following text by making it clearer, more engaging, and better written:\n\n"${text}"`;
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const improvedText = response.text();

    res.json({ 
      success: true, 
      originalText: text,
      improvedText: improvedText,
      improvementType: improvementType
    });
  } catch (error) {
    console.error('AI Improvement error:', error);
    res.status(500).json({ 
      error: 'Failed to improve content',
      details: error.message 
    });
  }
});

// Translate text
app.post('/ai/translate', authenticateToken, async (req, res) => {
  try {
    const { text, targetLanguage = 'Spanish' } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const prompt = `Please translate the following text to ${targetLanguage}:\n\n"${text}"`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const translatedText = response.text();

    res.json({ 
      success: true, 
      originalText: text,
      translatedText: translatedText,
      targetLanguage: targetLanguage
    });
  } catch (error) {
    console.error('AI Translation error:', error);
    res.status(500).json({ 
      error: 'Failed to translate content',
      details: error.message 
    });
  }
});

// Explain or analyze text
app.post('/ai/explain', authenticateToken, async (req, res) => {
  try {
    const { text, analysisType = 'general' } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    let prompt;
    switch (analysisType) {
      case 'tone':
        prompt = `Please analyze the tone and mood of the following text:\n\n"${text}"`;
        break;
      case 'keywords':
        prompt = `Please identify the main keywords and key concepts in the following text:\n\n"${text}"`;
        break;
      case 'structure':
        prompt = `Please analyze the structure and organization of the following text:\n\n"${text}"`;
        break;
      default:
        prompt = `Please provide a detailed analysis and explanation of the following text:\n\n"${text}"`;
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const analysis = response.text();

    res.json({ 
      success: true, 
      originalText: text,
      analysis: analysis,
      analysisType: analysisType
    });
  } catch (error) {
    console.error('AI Analysis error:', error);
    res.status(500).json({ 
      error: 'Failed to analyze content',
      details: error.message 
    });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
