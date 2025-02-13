// Import required modules
import { chromeStorage } from '../services/storage/chromeStorage.js';
import { API } from '../services/api.js';
import { EXTENSION_CONSTANTS } from '../utils/constants.js';

// Initialize API client
const api = new API();

// Setup context menus
chrome.runtime.onInstalled.addListener(() => {
  // Create context menu for saving prompts
  chrome.contextMenus.create({
    id: 'savePrompt',
    title: 'Save as Prompt',
    contexts: ['selection']
  });

  // Create context menu for quick insert
  chrome.contextMenus.create({
    id: 'insertPrompt',
    title: 'Insert Prompt',
    contexts: ['editable']
  });

  console.log('PromptHub extension installed and context menus created');
});

// Handle incoming messages
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.action) {
    case 'SAVE_PROMPT':
      handleSavePrompt(message.data)
        .then(response => sendResponse({ success: true, data: response }))
        .catch(error => sendResponse({ success: false, error }));
      break;

    case 'GET_PROMPT':
      handleGetPrompt(message.data)
        .then(response => sendResponse({ success: true, data: response }))
        .catch(error => sendResponse({ success: false, error }));
      break;

    case 'AUTH_STATE_CHANGE':
      handleAuthStateChange(message.data)
        .then(response => sendResponse({ success: true, data: response }))
        .catch(error => sendResponse({ success: false, error }));
      break;

    default:
      sendResponse({ success: false, error: 'Unknown action' });
  }

  // Return true to indicate we want to send a response asynchronously
  return true;
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  switch (info.menuItemId) {
    case 'savePrompt':
      handleSaveSelection(info.selectionText, tab);
      break;

    case 'insertPrompt':
      handleInsertPrompt(tab);
      break;
  }
});

// Handle authentication state changes
function handleAuthStateChange(authData) {
  return chromeStorage.set('authState', authData)
    .then(() => {
      console.log('Authentication state updated');
      return { status: 'success' };
    });
}

// Handle saving prompts
function handleSavePrompt(promptData) {
  return api.savePrompt(promptData)
    .then(response => {
      console.log('Prompt saved successfully');
      return response;
    });
}

// Handle getting prompts
function handleGetPrompt(promptId) {
  return api.getPrompt(promptId)
    .then(response => {
      console.log('Prompt retrieved successfully');
      return response;
    });
}

// Handle saving text selection as prompt
function handleSaveSelection(selectionText, tab) {
  const promptData = {
    content: selectionText,
    sourceUrl: tab.url,
    title: `Prompt from ${tab.title}`
  };

  return handleSavePrompt(promptData)
    .then(() => {
      chrome.tabs.sendMessage(tab.id, {
        action: 'SHOW_NOTIFICATION',
        data: { message: 'Prompt saved successfully' }
      });
    });
}

// Handle inserting prompt into editable fields
function handleInsertPrompt(tab) {
  chrome.tabs.sendMessage(tab.id, {
    action: 'SHOW_PROMPT_SELECTOR'
  });
}

// Log extension initialization
console.log('PromptHub background script initialized');
