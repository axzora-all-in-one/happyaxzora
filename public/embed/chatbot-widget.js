// Chatbot Widget Embed Script
(function() {
  'use strict';

  // Extract chatbot ID from script URL
  const scripts = document.getElementsByTagName('script');
  let chatbotId = null;
  
  for (let script of scripts) {
    if (script.src && script.src.includes('/embed/')) {
      chatbotId = script.src.split('/embed/')[1];
      break;
    }
  }

  if (!chatbotId) {
    console.error('Chatbot ID not found in embed script');
    return;
  }

  // Create widget container
  const widgetContainer = document.createElement('div');
  widgetContainer.id = 'happyaxzora-chatbot-widget';
  widgetContainer.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 10000;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  `;

  // Create chat button
  const chatButton = document.createElement('button');
  chatButton.id = 'happyaxzora-chat-button';
  chatButton.innerHTML = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
  `;
  chatButton.style.cssText = `
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
    color: white;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  `;

  // Create chat window
  const chatWindow = document.createElement('div');
  chatWindow.id = 'happyaxzora-chat-window';
  chatWindow.style.cssText = `
    position: absolute;
    bottom: 80px;
    right: 0;
    width: 350px;
    height: 450px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    display: none;
    flex-direction: column;
    overflow: hidden;
    border: 1px solid #e5e7eb;
  `;

  // Create chat header
  const chatHeader = document.createElement('div');
  chatHeader.style.cssText = `
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  `;
  chatHeader.innerHTML = `
    <div>
      <div style="font-weight: 600; font-size: 16px;">Support Bot</div>
      <div style="font-size: 12px; opacity: 0.8;">Online</div>
    </div>
    <button id="happyaxzora-close-chat" style="background: none; border: none; color: white; cursor: pointer; font-size: 20px;">×</button>
  `;

  // Create messages container
  const messagesContainer = document.createElement('div');
  messagesContainer.id = 'happyaxzora-messages';
  messagesContainer.style.cssText = `
    flex: 1;
    overflow-y: auto;
    padding: 16px;
    background: #f9fafb;
  `;

  // Create input container
  const inputContainer = document.createElement('div');
  inputContainer.style.cssText = `
    padding: 16px;
    border-top: 1px solid #e5e7eb;
    background: white;
  `;

  const inputForm = document.createElement('form');
  inputForm.style.cssText = `
    display: flex;
    gap: 8px;
  `;

  const messageInput = document.createElement('input');
  messageInput.type = 'text';
  messageInput.placeholder = 'Type your message...';
  messageInput.style.cssText = `
    flex: 1;
    padding: 8px 12px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    outline: none;
    font-size: 14px;
  `;

  const sendButton = document.createElement('button');
  sendButton.type = 'submit';
  sendButton.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <line x1="22" y1="2" x2="11" y2="13"></line>
      <polygon points="22,2 15,22 11,13 2,9 22,2"></polygon>
    </svg>
  `;
  sendButton.style.cssText = `
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    padding: 8px 12px;
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  `;

  // State management
  let isOpen = false;
  let messages = [];

  // Initialize widget
  function initWidget() {
    // Assemble chat window
    inputForm.appendChild(messageInput);
    inputForm.appendChild(sendButton);
    inputContainer.appendChild(inputForm);
    
    chatWindow.appendChild(chatHeader);
    chatWindow.appendChild(messagesContainer);
    chatWindow.appendChild(inputContainer);
    
    widgetContainer.appendChild(chatButton);
    widgetContainer.appendChild(chatWindow);
    
    document.body.appendChild(widgetContainer);

    // Add initial greeting
    addMessage('bot', 'Hello! I\'m here to help you with any questions you might have. How can I assist you today?');

    // Event listeners
    chatButton.addEventListener('click', toggleChat);
    document.getElementById('happyaxzora-close-chat').addEventListener('click', toggleChat);
    inputForm.addEventListener('submit', handleSubmit);
    
    // Hover effects
    chatButton.addEventListener('mouseenter', () => {
      chatButton.style.transform = 'scale(1.05)';
    });
    
    chatButton.addEventListener('mouseleave', () => {
      chatButton.style.transform = 'scale(1)';
    });
  }

  // Toggle chat window
  function toggleChat() {
    isOpen = !isOpen;
    chatWindow.style.display = isOpen ? 'flex' : 'none';
    
    if (isOpen) {
      messageInput.focus();
    }
  }

  // Handle form submission
  function handleSubmit(e) {
    e.preventDefault();
    const message = messageInput.value.trim();
    
    if (!message) return;
    
    addMessage('user', message);
    messageInput.value = '';
    
    // Send to chatbot API
    sendMessageToBot(message);
  }

  // Add message to chat
  function addMessage(type, content) {
    const messageDiv = document.createElement('div');
    messageDiv.style.cssText = `
      margin-bottom: 12px;
      display: flex;
      ${type === 'user' ? 'justify-content: flex-end' : 'justify-content: flex-start'};
    `;

    const messageContent = document.createElement('div');
    messageContent.style.cssText = `
      max-width: 80%;
      padding: 8px 12px;
      border-radius: 12px;
      font-size: 14px;
      line-height: 1.4;
      ${type === 'user' 
        ? 'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-bottom-right-radius: 4px;' 
        : 'background: white; color: #374151; border: 1px solid #e5e7eb; border-bottom-left-radius: 4px;'
      }
    `;
    messageContent.textContent = content;

    messageDiv.appendChild(messageContent);
    messagesContainer.appendChild(messageDiv);
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  // Send message to chatbot API
  async function sendMessageToBot(message) {
    // Add typing indicator
    const typingDiv = document.createElement('div');
    typingDiv.id = 'typing-indicator';
    typingDiv.style.cssText = `
      margin-bottom: 12px;
      display: flex;
      justify-content: flex-start;
    `;
    
    const typingContent = document.createElement('div');
    typingContent.style.cssText = `
      background: white;
      color: #6b7280;
      border: 1px solid #e5e7eb;
      padding: 8px 12px;
      border-radius: 12px;
      border-bottom-left-radius: 4px;
      font-size: 14px;
      font-style: italic;
    `;
    typingContent.textContent = 'Typing...';
    
    typingDiv.appendChild(typingContent);
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    try {
      const response = await fetch('/api/chatbots/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatbotId: chatbotId,
          message: message,
          userId: 'widget_user'
        }),
      });

      const data = await response.json();
      
      // Remove typing indicator
      const typing = document.getElementById('typing-indicator');
      if (typing) {
        typing.remove();
      }
      
      // Add bot response
      addMessage('bot', data.response || 'I apologize, but I couldn\'t process your request. Please try again.');
      
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Remove typing indicator
      const typing = document.getElementById('typing-indicator');
      if (typing) {
        typing.remove();
      }
      
      addMessage('bot', 'Sorry, I\'m having trouble connecting. Please try again later.');
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWidget);
  } else {
    initWidget();
  }

})();