/**
 * Page manipulation utilities for Chrome extension
 */

export const pageUtils = {
  /**
   * Check if element is a text field
   * @param {HTMLElement} element - DOM element to check
   * @returns {boolean} True if element is a text field
   */
  isTextField(element) {
    if (!element || !element.tagName) return false;

    return (
      element.tagName === 'TEXTAREA' ||
      (element.tagName === 'INPUT' &&
       ['text', 'search', 'email', 'password', 'url'].includes(element.type)) ||
      element.isContentEditable
    );
  },

  /**
   * Get currently selected text in document
   * @returns {string} Selected text
   */
  getSelectedText() {
    return window.getSelection().toString();
  },

  /**
   * Insert text at cursor position
   * @param {string} text - Text to insert
   */
  insertTextAtCursor(text) {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      range.insertNode(document.createTextNode(text));
    }
  },

  /**
   * Find all text fields in document
   * @returns {HTMLElement[]} Array of text field elements
   */
  findTextFields() {
    const inputs = Array.from(document.querySelectorAll('input, textarea'));
    const contentEditables = Array.from(document.querySelectorAll('[contenteditable="true"]'));

    return [...inputs, ...contentEditables].filter(el => this.isTextField(el));
  },

  /**
   * Handle text input event for an element
   * @param {HTMLElement} element - Element to handle input for
   */
  handleTextInput(element) {
    if (!this.isTextField(element)) {
      throw new Error('Element is not a text field');
    }

    element.addEventListener('input', (e) => {
      // Handle input event
      console.log('Text input detected:', e.target.value);
    });
  },

  /**
   * Handle iframe content
   * @param {HTMLIFrameElement} iframe - Iframe element
   * @returns {Document} Iframe document
   */
  getIframeDocument(iframe) {
    try {
      return iframe.contentDocument || iframe.contentWindow.document;
    } catch (e) {
      console.error('Cannot access iframe content:', e);
      return null;
    }
  }
};
