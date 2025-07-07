// ✅ Toggle Dropdowns
function toggleDropdown(btnId, dropdownId) {
  const dropdown = document.getElementById(dropdownId);
  dropdown.classList.toggle('hidden');

  // Hide all others
  ['fileDropdown', 'editDropdown', 'insertDropdown', 'viewDropdown', 'helpDropdown'].forEach(id => {
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

document.getElementById('helpBtn').addEventListener('click', () => {
  toggleDropdown('helpBtn', 'helpDropdown');
});

// ✅ Close dropdowns when clicking outside
// Close dropdowns when clicking outside
document.addEventListener('click', (e) => {
  if (!e.target.closest('.menu-button') && !e.target.closest('.dropdown-menu')) {
    ['fileDropdown', 'editDropdown', 'insertDropdown', 'viewDropdown', 'helpDropdown'].forEach(id => {
      document.getElementById(id).classList.add('hidden');
    });
  }
});

// Prevent dropdown from closing when clicked
['fileBtn', 'editBtn', 'insertBtn', 'viewBtn', 'helpBtn'].forEach(id => {
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
