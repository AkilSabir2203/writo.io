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
