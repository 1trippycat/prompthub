// Content script for PromptHub Chrome extension
import { pageUtils } from './pageUtils.js';
import { EXTENSION_CONSTANTS } from '../utils/constants.js';

// Track active text field
let activeTextField = null;

// Handle text field detection
document.addEventListener('focusin', (event) => {
  if (pageUtils.isTextField(event.target)) {
    activeTextField = event.target;
    notifyPromptAvailable();
  }
});

// Handle text field blur
document.addEventListener('focusout', () => {
  activeTextField = null;
});

// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'INSERT_PROMPT') {
    insertPromptIntoActiveElement(request.prompt);
  } else if (request.action === 'SHOW_PROMPT_SELECTOR') {
    showPromptSelector();
  } else if (request.action === 'SHOW_NOTIFICATION') {
    showNotification(request.data.message);
  } else if (request.type === EXTENSION_CONSTANTS.GET_ACTIVE_FIELD) {
    sendResponse({
      hasActiveField: !!activeTextField,
      fieldType: activeTextField?.tagName
    });
  }
});

// Insert prompt into the active element
function insertPromptIntoActiveElement(prompt) {
  const activeElement = document.activeElement;
  if (pageUtils.isTextField(activeElement)) {
    pageUtils.insertTextAtCursor(prompt);
  } else {
    console.error('Active element is not a text field');
  }
}

// Notify background script that a prompt can be inserted
function notifyPromptAvailable() {
  chrome.runtime.sendMessage({
    action: 'PROMPT_AVAILABLE',
    hasActiveField: true
  });
}

// Show prompt selector UI
function showPromptSelector() {
  // Implementation for showing prompt selector UI
  console.log('Show prompt selector UI');
}

// Show notification
function showNotification(message) {
  // Implementation for showing notification
  console.log('Notification:', message);
}

// Cleanup listeners on script unload
window.addEventListener('unload', () => {
  document.removeEventListener('focusin', handleFocusIn);
  document.removeEventListener('focusout', handleFocusOut);
  chrome.runtime.onMessage.removeListener(handleMessage);
});

function handleFocusIn(event) {
  if (pageUtils.isTextField(event.target)) {
    notifyPromptAvailable();
  }
}

function handleMessage(request, sender, sendResponse) {
  if (request.action === 'INSERT_PROMPT') {
    insertPromptIntoActiveElement(request.prompt);
  } else if (request.action === 'SHOW_PROMPT_SELECTOR') {
    showPromptSelector();
  } else if (request.action === 'SHOW_NOTIFICATION') {
    showNotification(request.data.message);
  }
}
