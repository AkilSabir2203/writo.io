// ✅ Theme Management
function initializeTheme() {
  // Get saved theme from localStorage or default to light
  const savedTheme = localStorage.getItem('theme') || 'light';
  applyTheme(savedTheme);
}

function applyTheme(theme) {
  const body = document.body;
  const themeIcon = document.getElementById('themeIcon');
  
  if (theme === 'dark') {
    body.setAttribute('data-theme', 'dark');
    themeIcon.className = 'fas fa-sun'; // Sun icon for dark mode (to switch to light)
  } else {
    body.removeAttribute('data-theme');
    themeIcon.className = 'fas fa-moon'; // Moon icon for light mode (to switch to dark)
  }
  
  // Save theme preference
  localStorage.setItem('theme', theme);
}

function toggleTheme() {
  const currentTheme = document.body.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  applyTheme(newTheme);
}

// Initialize theme on page load
document.addEventListener('DOMContentLoaded', initializeTheme);

// Add event listener for theme toggle button
document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }
});

// ✅ Toggle Dropdowns
function toggleDropdown(btnId, dropdownId) {
  const dropdown = document.getElementById(dropdownId);
  dropdown.classList.toggle('hidden');

  // Hide all others
  ['fileDropdown', 'editDropdown', 'insertDropdown', 'viewDropdown', 'aiDropdown', 'helpDropdown'].forEach(id => {
    if (id !== dropdownId) {
      document.getElementById(id).classList.add('hidden');
    }
  });
}

// ✅ Attach Event Listeners
document.getElementById('fileBtn').addEventListener('click', () => {
  toggleDropdown('fileBtn', 'fileDropdown');
});

document.getElementById('editBtn').addEventListener('click', () => {
  toggleDropdown('editBtn', 'editDropdown');
});

document.getElementById('insertBtn').addEventListener('click', () => {
  toggleDropdown('insertBtn', 'insertDropdown');
});

document.getElementById('viewBtn').addEventListener('click', () => {
  toggleDropdown('viewBtn', 'viewDropdown');
});

document.getElementById('aiBtn').addEventListener('click', () => {
  toggleDropdown('aiBtn', 'aiDropdown');
});

document.getElementById('helpBtn').addEventListener('click', () => {
  toggleDropdown('helpBtn', 'helpDropdown');
});

// ✅ Close dropdowns when clicking outside
// Close dropdowns when clicking outside
document.addEventListener('click', (e) => {
  if (!e.target.closest('.menu-button') && !e.target.closest('.dropdown-menu')) {
    ['fileDropdown', 'editDropdown', 'insertDropdown', 'viewDropdown', 'aiDropdown', 'helpDropdown'].forEach(id => {
      document.getElementById(id).classList.add('hidden');
    });
  }
});

// Prevent dropdown from closing when clicked
['fileBtn', 'editBtn', 'insertBtn', 'viewBtn', 'aiBtn', 'helpBtn'].forEach(id => {
  document.getElementById(id).addEventListener('click', (e) => {
    e.stopPropagation(); // ⛔ Stop event from bubbling to document click
  });
});


// ✅ Update word/line count
const textInput = document.getElementById('textInput');
const lineCount = document.getElementById('lineCount');
const wordCount = document.getElementById('wordCount');

textInput.addEventListener('input', () => {
  const text = textInput.value;
  const lines = text.split(/\n/).length;
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  lineCount.textContent = `Lines: ${text ? lines : 0}`;
  wordCount.textContent = `Words: ${text ? words : 0}`;
});

// ✅ Clear document on New Document click
function clearDocument() {
  textInput.value = '';
  lineCount.textContent = 'Lines: 0';
  wordCount.textContent = 'Words: 0';
  textInput.focus();
}

document.getElementById('newDocBtn').addEventListener('click', clearDocument);
document.getElementById('toolbarNewDoc').addEventListener('click', clearDocument);

function copyToClipboard() {
  const text = textInput.value;
  if (!text) return;

  // Use Clipboard API
  navigator.clipboard.writeText(text).then(() => {
    showCopyMessage(); // ✨ Show floating message
  }).catch(err => {
    console.error('Copy failed:', err);
  });
}

document.getElementById('copyBtn').addEventListener('click', copyToClipboard);
document.getElementById('toolbarCopy').addEventListener('click', copyToClipboard);

function showCopyMessage() {
  const messageBox = document.getElementById('copyMessage');
  messageBox.classList.remove('hidden');

  setTimeout(() => {
    messageBox.classList.add('hidden');
  }, 1000); // Hide after 1 second
}

function cutSelectedText() {
  const start = textInput.selectionStart;
  const end = textInput.selectionEnd;

  if (start === end) return; // No text selected

  const selectedText = textInput.value.slice(start, end);

  // Copy to clipboard
  navigator.clipboard.writeText(selectedText).then(() => {
    // Remove selected text
    textInput.setRangeText('', start, end, 'start');
    textInput.dispatchEvent(new Event('input')); // Update word/line count
  }).catch(err => {
    console.error('Cut failed:', err);
  });
}

// Add event listeners
document.getElementById('cutBtn').addEventListener('click', cutSelectedText);
document.getElementById('toolbarCut').addEventListener('click', cutSelectedText);

const fileInput = document.getElementById('fileInput');

// Trigger file input when "Open..." is clicked
document.querySelectorAll('.openFileBtn').forEach(btn => {
  btn.addEventListener('click', () => {
    fileInput.click();
  });
});

// Read file content and load into textarea
fileInput.addEventListener('change', () => {
  const file = fileInput.files[0];
  if (file && file.name.endsWith('.txt')) {
    const reader = new FileReader();
    reader.onload = function (e) {
      textInput.value = e.target.result;
      textInput.dispatchEvent(new Event('input')); // Update counts
    };
    reader.readAsText(file);
  } else {
    alert('Please select a .txt file');
  }
});

//Undo
function undoEdit() {
  const textarea = document.getElementById('textInput');
  textarea.focus();
  document.execCommand('undo');
  textarea.dispatchEvent(new Event('input')); // update counters
}

document.getElementById('undoBtn').addEventListener('click', undoEdit);
document.getElementById('redoBtn').addEventListener('click', redoEdit);

//Redo
function redoEdit() {
  const textarea = document.getElementById('textInput');
  textarea.focus();
  document.execCommand('redo');
  textarea.dispatchEvent(new Event('input')); // update counters
}

document.getElementById('toolbarUndo').addEventListener('click', undoEdit);
document.getElementById('toolbarRedo').addEventListener('click', redoEdit);

function printEditorContent() {
  const content = document.getElementById('textInput').value;
  const printWindow = window.open('', '_blank');

  printWindow.document.write(`
    <html>
      <head>
        <title>Print Document</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 40px;
            white-space: pre-wrap;
          }
        </style>
      </head>
      <body>${content.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>')}</body>
    </html>
  `);

  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
  printWindow.close();
}

// Attach events
document.getElementById('printBtn').addEventListener('click', printEditorContent);
document.getElementById('toolbarPrint').addEventListener('click', printEditorContent);

// ✅ Fullscreen functionality
function toggleFullscreen() {
  if (!document.fullscreenElement) {
    // Enter fullscreen
    document.documentElement.requestFullscreen().catch(err => {
      console.error('Error attempting to enable fullscreen:', err);
    });
  } else {
    // Exit fullscreen
    document.exitFullscreen().catch(err => {
      console.error('Error attempting to exit fullscreen:', err);
    });
  }
}

// Add event listeners for fullscreen
document.getElementById('toolbarFullscreen').addEventListener('click', toggleFullscreen);
document.getElementById('viewFullscreen').addEventListener('click', toggleFullscreen);

// Add keyboard shortcut for Ctrl+Shift+F
document.addEventListener('keydown', (event) => {
  if (event.ctrlKey && event.shiftKey && event.key === 'F') {
    event.preventDefault(); // Prevent browser's default find in files
    toggleFullscreen();
  }
});

function openFindReplaceDialog() {
  const findText = prompt('Enter the word to find:');
  if (!findText) return;

  const replaceText = prompt(`Replace "${findText}" with:`);
  if (replaceText === null) return;

  const editor = document.getElementById('textInput');
  const content = editor.value;

  // Use a global, case-insensitive RegExp to replace all matches
  const regex = new RegExp(findText, 'gi');
  const newContent = content.replace(regex, replaceText);

  editor.value = newContent;

  // Trigger input event to update line/word count
  editor.dispatchEvent(new Event('input'));
}


document.getElementById('editFindReplace').addEventListener('click', openFindReplaceDialog);
document.getElementById('findReplaceBtn').addEventListener('click', openFindReplaceDialog);

document.getElementById('fontFamilyDropdown').addEventListener('change', function () {
  const selectedFont = this.value;
  document.getElementById('textInput').style.fontFamily = selectedFont;
});

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('textInput').style.fontFamily = 'Arial';
});

// ========== AI FUNCTIONALITY ==========

const API_BASE_URL = 'http://localhost:3000';

// AI Modal Management
const aiModal = document.getElementById('aiModal');
const aiModalTitle = document.getElementById('aiModalTitle');
const aiLoadingSpinner = document.getElementById('aiLoadingSpinner');
const aiResults = document.getElementById('aiResults');
const aiOriginalSection = document.getElementById('aiOriginalSection');
const aiOriginalText = document.getElementById('aiOriginalText');
const aiResponseSection = document.getElementById('aiResponseSection');
const aiResponseText = document.getElementById('aiResponseText');
const closeAiModalBtn = document.getElementById('closeAiModal');
const aiCopyResultBtn = document.getElementById('aiCopyResult');
const aiReplaceTextBtn = document.getElementById('aiReplaceText');
const aiInsertTextBtn = document.getElementById('aiInsertText');

let currentAiResponse = '';
let originalTextForReplacement = '';
let selectionStart = 0;
let selectionEnd = 0;

// Show AI Modal
function showAiModal(title) {
  aiModalTitle.textContent = title;
  aiModal.classList.remove('hidden');
  showLoadingSpinner();
}

// Hide AI Modal
function hideAiModal() {
  aiModal.classList.add('hidden');
  hideLoadingSpinner();
  hideResults();
}

// Show loading spinner
function showLoadingSpinner() {
  aiLoadingSpinner.classList.remove('hidden');
  aiResults.classList.add('hidden');
}

// Hide loading spinner
function hideLoadingSpinner() {
  aiLoadingSpinner.classList.add('hidden');
  aiResults.classList.remove('hidden');
}

// Show results
function showResults(originalText = '', responseText = '', showOriginal = true) {
  currentAiResponse = responseText;
  originalTextForReplacement = originalText;
  
  if (showOriginal && originalText) {
    aiOriginalText.textContent = originalText;
    aiOriginalSection.classList.remove('hidden');
  } else {
    aiOriginalSection.classList.add('hidden');
  }
  
  aiResponseText.textContent = responseText;
  aiResponseSection.classList.remove('hidden');
  
  // Show appropriate action buttons
  aiCopyResultBtn.classList.remove('hidden');
  if (originalText) {
    aiReplaceTextBtn.classList.remove('hidden');
  } else {
    aiInsertTextBtn.classList.remove('hidden');
  }
}

// Hide results
function hideResults() {
  aiOriginalSection.classList.add('hidden');
  aiResponseSection.classList.add('hidden');
  aiCopyResultBtn.classList.add('hidden');
  aiReplaceTextBtn.classList.add('hidden');
  aiInsertTextBtn.classList.add('hidden');
}

// Get selected text or all text
function getTextForAI() {
  const textInput = document.getElementById('textInput');
  const selectedText = textInput.value.substring(textInput.selectionStart, textInput.selectionEnd);
  
  selectionStart = textInput.selectionStart;
  selectionEnd = textInput.selectionEnd;
  
  if (selectedText.trim()) {
    return selectedText;
  }
  
  // If no selection, use all text
  selectionStart = 0;
  selectionEnd = textInput.value.length;
  return textInput.value;
}

// Make authenticated API call to backend
async function callAI(endpoint, data) {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    
    // Handle authentication errors
    if (response.status === 401 || response.status === 403) {
      removeToken();
      window.location.href = 'index.html';
      return;
    }
    
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'AI request failed');
    }
    
    return result;
  } catch (error) {
    console.error('AI API Error:', error);
    throw error;
  }
}

// AI Improve Text
async function aiImproveText(improvementType = 'general') {
  const text = getTextForAI();
  
  if (!text.trim()) {
    alert('Please select some text or write something first.');
    return;
  }
  
  const titles = {
    general: 'AI Text Improvement',
    grammar: 'AI Grammar Correction',
    professional: 'AI Professional Tone',
    casual: 'AI Casual Tone',
    clarity: 'AI Clarity Enhancement'
  };

   showAiModal(titles[improvementType] || titles.general);
  
  try {
    const result = await callAI('/ai/improve', { text, improvementType });
    hideLoadingSpinner();
    showResults(result.originalText, result.improvedText);
  } catch (error) {
    hideLoadingSpinner();
    alert('Failed to improve text: ' + error.message);
    hideAiModal();
  }
}

// AI Summarize Text
async function aiSummarizeText() {
  const text = getTextForAI();
  
  if (!text.trim()) {
    alert('Please select some text or write something first.');
    return;
  }
  
  showAiModal('AI Text Summarization');
  
  const summaryLength = prompt('Summary length (short/medium/long):', 'medium') || 'medium';
  
  try {
    const result = await callAI('/ai/summarize', { text, summaryLength });
    hideLoadingSpinner();
    showResults(result.originalText, result.summary);
  } catch (error) {
    hideLoadingSpinner();
    alert('Failed to summarize text: ' + error.message);
    hideAiModal();
  }
}

// AI Translate Text
async function aiTranslateText() {
  const text = getTextForAI();
  
  if (!text.trim()) {
    alert('Please select some text or write something first.');
    return;
  }
  
  const targetLanguage = prompt('Translate to which language?', 'Spanish');
  if (!targetLanguage) return;
  
  showAiModal('AI Text Translation');
  
  try {
    const result = await callAI('/ai/translate', { text, targetLanguage });
    hideLoadingSpinner();
    showResults(result.originalText, result.translatedText);
  } catch (error) {
    hideLoadingSpinner();
    alert('Failed to translate text: ' + error.message);
    hideAiModal();
  }
}

// AI Explain Text
async function aiExplainText() {
  const text = getTextForAI();
  
  if (!text.trim()) {
    alert('Please select some text or write something first.');
    return;
  }
  
  showAiModal('AI Text Analysis');

  const analysisType = prompt('Analysis type (general/tone/keywords/structure):', 'general') || 'general';
  
  try {
    const result = await callAI('/ai/explain', { text, analysisType });
    hideLoadingSpinner();
    showResults(result.originalText, result.analysis);
  } catch (error) {
    hideLoadingSpinner();
    alert('Failed to analyze text: ' + error.message);
    hideAiModal();
  }
}

// Copy AI result to clipboard
function copyAiResult() {
  navigator.clipboard.writeText(currentAiResponse).then(() => {
    showCopyMessage();
  }).catch(err => {
    console.error('Failed to copy text: ', err);
  });
}

// Replace original text with AI result
function replaceWithAiResult() {
  const textInput = document.getElementById('textInput');
  const currentText = textInput.value;
  const newText = currentText.substring(0, selectionStart) + currentAiResponse + currentText.substring(selectionEnd);
  
  textInput.value = newText;
  textInput.dispatchEvent(new Event('input')); // Update word/line count
  hideAiModal();
}

// Insert AI result at cursor position
function insertAiResult() {
  const textInput = document.getElementById('textInput');
  const cursorPos = textInput.selectionStart;
  const currentText = textInput.value;
  const newText = currentText.substring(0, cursorPos) + currentAiResponse + currentText.substring(cursorPos);
  
  textInput.value = newText;
  textInput.setSelectionRange(cursorPos + currentAiResponse.length, cursorPos + currentAiResponse.length);
  textInput.dispatchEvent(new Event('input')); // Update word/line count
  hideAiModal();
}

// Event Listeners for AI Menu Items
document.getElementById('aiImproveGeneral').addEventListener('click', () => aiImproveText('general'));
document.getElementById('aiImproveGrammar').addEventListener('click', () => aiImproveText('grammar'));
document.getElementById('aiImproveProfessional').addEventListener('click', () => aiImproveText('professional'));
document.getElementById('aiImproveCasual').addEventListener('click', () => aiImproveText('casual'));
document.getElementById('aiSummarize').addEventListener('click', aiSummarizeText);
document.getElementById('aiTranslate').addEventListener('click', aiTranslateText);
document.getElementById('aiExplain').addEventListener('click', aiExplainText);

// Event Listeners for AI Modal
closeAiModalBtn.addEventListener('click', hideAiModal);
aiCopyResultBtn.addEventListener('click', copyAiResult);
aiReplaceTextBtn.addEventListener('click', replaceWithAiResult);
aiInsertTextBtn.addEventListener('click', insertAiResult);

// Close modal when clicking outside
aiModal.addEventListener('click', (e) => {
  if (e.target === aiModal) {
    hideAiModal();
  }
});

// Show copy message
function showCopyMessage() {
  const copyMessage = document.getElementById('copyMessage');
  copyMessage.classList.remove('hidden');
  setTimeout(() => {
    copyMessage.classList.add('hidden');
  }, 2000);
}

// ========== SAVE/LOAD FUNCTIONALITY ==========

let autoSaveTimeout;
const AUTO_SAVE_DELAY = 2000; // 2 seconds after user stops typing

// Auto-save functionality
function setupAutoSave() {
  const textInput = document.getElementById('textInput');
  
  textInput.addEventListener('input', function() {
    clearTimeout(autoSaveTimeout);
    autoSaveTimeout = setTimeout(async function() {
      await saveCurrentNote();
    }, AUTO_SAVE_DELAY);
  });
}

// Save current note
async function saveCurrentNote() {
  try {
    const textInput = document.getElementById('textInput');
    const content = textInput.value;
    
    const result = await saveNote(content);
    
    if (result.success) {
      console.log('Note auto-saved successfully');
      // Optionally show a subtle indicator that the note was saved
      showSaveIndicator();
    } else {
      console.error('Failed to save note:', result.message);
    }
  } catch (error) {
    console.error('Auto-save error:', error);
  }
}

// Load user's note
async function loadUserNote() {
  try {
    const result = await loadNote();
    
    if (result.success && result.content) {
      const textInput = document.getElementById('textInput');
      textInput.value = result.content;
      
      // Update word/character count
      textInput.dispatchEvent(new Event('input'));
      
      console.log('Note loaded successfully');
    }
  } catch (error) {
    console.error('Failed to load note:', error);
  }
}

// Show save indicator
function showSaveIndicator() {
  // You can implement a subtle save indicator here
  // For now, we'll just log it
  console.log('Document saved');
}

// Manual save function (for Ctrl+S)
async function manualSave() {
  await saveCurrentNote();
  showSaveIndicator();
}

// Add keyboard shortcut for Ctrl+S
document.addEventListener('keydown', function(e) {
  if (e.ctrlKey && e.key === 's') {
    e.preventDefault();
    manualSave();
  }
});

// Initialize save/load functionality when page loads
document.addEventListener('DOMContentLoaded', function() {
  // Load user's existing note
  loadUserNote();
  
  // Setup auto-save
  setupAutoSave();
});