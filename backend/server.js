const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const User = require('./models/User');

const Note = mongoose.model('Note', {
  email: String,
  content: String
});

const app = express();
app.use(cors());
app.use(express.json());

const MONGO_URI = 'mongodb+srv://akilsabir2207:%40kiL2207@documenteditorcluster.jiej7lu.mongodb.net/document-editor?retryWrites=true&w=majority&appName=DocumentEditorCluster';

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

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
