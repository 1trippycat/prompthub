// Content script for PromptHub Chrome extension
import { isTextField, insertText } from './pageUtils';
import { MESSAGE_TYPES } from '../../utils/constants';

// Track active text field
let activeTextField = null;

// Handle text field detection
document.addEventListener('focusin', (event) => {
  if (isTextField(event.target)) {
    activeTextField = event.target;
    notifyPromptAvailable();
  }
});

// Handle text field blur
document.addEventListener('focusout', () => {
  activeTextField = null;
});

// Handle message from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.type) {
    case MESSAGE_TYPES.INSERT_PROMPT:
      if (activeTextField) {
        insertText(activeTextField, request.prompt);
      }
      break;

    case MESSAGE_TYPES.GET_ACTIVE_FIELD:
      sendResponse({
        hasActiveField: !!activeTextField,
        fieldType: activeTextField?.tagName
      });
      break;

    default:
      break;
  }
});

// Notify background script when prompt is available
function notifyPromptAvailable() {
  chrome.runtime.sendMessage({
    type: MESSAGE_TYPES.PROMPT_AVAILABLE,
    hasActiveField: true
  });
}

// Handle context menu actions
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === MESSAGE_TYPES.CONTEXT_MENU_INSERT) {
    const selection = window.getSelection().toString();
    if (selection && activeTextField) {
      insertText(activeTextField, request.prompt.replace('{selection}', selection));
    }
  }
});

// Cleanup listeners on script unload
window.addEventListener('unload', () => {
  document.removeEventListener('focusin', handleFocusIn);
  document.removeEventListener('focusout', handleFocusOut);
});
