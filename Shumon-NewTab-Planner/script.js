document.addEventListener('DOMContentLoaded', () => {
  // --- Date Logic ---
  const dateElement = document.getElementById('current-date');
  const dayElement = document.getElementById('current-day');
  const today = new Date();

  const dateOptions = { day: 'numeric', month: 'long', year: 'numeric' };
  const dayOptions = { weekday: 'long' };

  dateElement.textContent = today.toLocaleDateString('en-GB', dateOptions);
  dayElement.textContent = today.toLocaleDateString('en-GB', dayOptions);

  // --- Notepad Logic ---
  const textareas = document.querySelectorAll('textarea');

  // Load saved notes when the tab opens
  chrome.storage.local.get(['notes'], function(result) {
    const notes = result.notes || {};
    textareas.forEach(textarea => {
      if (notes[textarea.id]) {
        textarea.value = notes[textarea.id];
      }
    });
  });

  // Save notes automatically as you type
  textareas.forEach(textarea => {
    textarea.addEventListener('input', () => {
      chrome.storage.local.get(['notes'], function(result) {
        const notes = result.notes || {};
        notes[textarea.id] = textarea.value;
        chrome.storage.local.set({notes: notes});
      });
    });
  });

  // --- Clear All Logic ---
  const clearAllBtn = document.getElementById('clear-all-btn');
  
  clearAllBtn.addEventListener('click', () => {
    // Show a confirmation popup
    if (confirm("Are you sure you want to clear all your notes? This cannot be undone.")) {
      
      // 1. Empty the text boxes on the screen
      textareas.forEach(textarea => {
        textarea.value = '';
      });
      
      // 2. Erase the saved notes from Chrome's memory
      chrome.storage.local.remove(['notes']);
    }
  });
});