const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
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

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

// Register
app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ message: 'Email already registered' });

  const hashed = await bcrypt.hash(password, 10);
  const user = new User({ email, password: hashed });
  await user.save();
  res.json({ message: 'Registration successful' });
});

// Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  res.json({ message: 'Login successful' });
});

// Save or update a note
app.post('/note', async (req, res) => {
  const { email, content } = req.body;
  const existing = await Note.findOne({ email });

  if (existing) {
    existing.content = content;
    await existing.save();
  } else {
    await new Note({ email, content }).save();
  }

  res.json({ message: 'Note saved successfully' });
});

// Get a user's note
app.get('/note/:email', async (req, res) => {
  const note = await Note.findOne({ email: req.params.email });
  res.json(note || {});
});

// ========== GEMINI AI ENDPOINTS ==========


// Improve/rewrite text
app.post('/ai/improve', async (req, res) => {
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
app.post('/ai/translate', async (req, res) => {
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
app.post('/ai/explain', async (req, res) => {
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
