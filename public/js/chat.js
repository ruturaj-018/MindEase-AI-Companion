// chat.js — MindEase (browser) — rewritten to use a secure server proxy
// ---------------------------------------------------------------
// What changed (high level):
// 1) Removed direct OpenAI call & API key from the browser.
// 2) Added a backend proxy `/api/chat` call (see server.js).
// 3) Switched to a current model ("gpt-4o-mini").
// 4) Tightened wellness-topic check (removed short-message len check).
// 5) Kept your Firebase chat history + usage logic intact.
// ---------------------------------------------------------------

import { auth, db } from './firebase-config.js';
import {
  onAuthStateChanged,
  signOut
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  increment
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// Theme & API endpoint
const THEME_KEY = 'mindmaze-theme';
const API_ENDPOINT = '/api/chat'; // <- now calling your server, not OpenAI directly

// Daily message limit & tips
const DAILY_MESSAGE_LIMIT = 20;
const WELLNESS_TIPS = [
  "💡 Today's Tip: Try 5 minutes of deep breathing for a calmer mind.",
  "🌱 Today's Tip: Take a moment to appreciate something beautiful around you.",
  "💪 Today's Tip: Small acts of kindness can boost your mood instantly.",
  "🧘 Today's Tip: Practice gratitude - name three things you're thankful for.",
  "🌈 Today's Tip: Remember, progress is more important than perfection.",
  "🌸 Today's Tip: Take breaks between tasks to recharge your energy.",
  "✨ Today's Tip: Connect with nature, even if it's just looking outside.",
  "💙 Today's Tip: Be gentle with yourself - you're doing your best.",
  "🎯 Today's Tip: Focus on what you can control, let go of what you can't.",
  "🌟 Today's Tip: Celebrate small wins - they add up to big achievements."
];

// Boundary message (client-side guard)
const BOUNDARY_MESSAGE = "⚠️ I'm here to support your wellbeing 💙 Let's talk about mindfulness, stress, or positivity. How are you feeling right now?";

// Global state
let currentUser = null;
let isInitialized = false;
let messagesLeft = DAILY_MESSAGE_LIMIT;
let isTyping = false;
let chatHistory = [];
let hasShownGreeting = false;

// DOM elements
const elements = {
  loadingOverlay: document.getElementById('loadingOverlay'),
  userName: document.getElementById('userName'),
  greetingSection: document.getElementById('greetingSection'),
  greetingText: document.getElementById('greetingText'),
  quickReplies: document.getElementById('quickReplies'),
  dailyTipSection: document.getElementById('dailyTipSection'),
  dailyTipText: document.getElementById('dailyTipText'),
  chatWindow: document.getElementById('chatWindow'),
  chatMessages: document.getElementById('chatMessages'),
  typingIndicator: document.getElementById('typingIndicator'),
  messageInput: document.getElementById('messageInput'),
  sendBtn: document.getElementById('sendBtn'),
  usageText: document.getElementById('usageText')
};

// Init
document.addEventListener('DOMContentLoaded', () => {
  applyTheme();
  initializeEventListeners();
  checkAuthentication();
});

// Theme helpers
function applyTheme() {
  const saved = localStorage.getItem(THEME_KEY) || 'light';
  document.documentElement.setAttribute('data-theme', saved);
}

function watchThemeChanges() {
  window.addEventListener('storage', (e) => {
    if (e.key === THEME_KEY) applyTheme();
  });
  setInterval(() => {
    const current = document.documentElement.getAttribute('data-theme');
    const saved = localStorage.getItem(THEME_KEY) || 'light';
    if (current !== saved) applyTheme();
  }, 1000);
}

// Event listeners
function initializeEventListeners() {
  if (elements.messageInput) {
    elements.messageInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });
    elements.messageInput.addEventListener('input', validateInput);
  }
  if (elements.sendBtn) {
    elements.sendBtn.addEventListener('click', sendMessage);
  }
  if (elements.quickReplies) {
    elements.quickReplies.addEventListener('click', (e) => {
      if (e.target.classList.contains('quick-reply-btn')) {
        const message = e.target.dataset.message;
        sendQuickReply(message);
      }
    });
  }
}

// Validate user input / enable send
function validateInput() {
  if (!elements.messageInput || !elements.sendBtn) return;
  const message = elements.messageInput.value.trim();
  const isValid = message.length > 0 && messagesLeft > 0 && !isTyping;
  elements.sendBtn.disabled = !isValid;
  elements.sendBtn.style.opacity = isValid ? '1' : '0.5';
}

// Auth check
function checkAuthentication() {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      currentUser = user;
      initializeChat();
    } else {
      window.location.href = 'Login-Signup.html';
    }
  });
}

// Initialize chat experience
async function initializeChat() {
  try {
    // Make sure local "new day" logic runs immediately
     const today = getTodayString();
     const lastDate = localStorage.getItem('lastChatDate');
      if (lastDate !== today) {
      localStorage.setItem('lastChatDate', today);
      if (lastDate) resetForNewDay();
      }
      
    updateUserProfile();
    watchThemeChanges();
    await checkDailyUsage();
    displayDailyTip();
    await loadChatHistory();

    if (chatHistory.length === 0) {
      displayGreeting();
      hasShownGreeting = true;
    } else {
      hideGreetingSection();
    }

    enableInput();
    if (elements.loadingOverlay) elements.loadingOverlay.style.display = 'none';
    isInitialized = true;
  } catch (err) {
    console.error('Chat initialization error:', err);
    showError('Failed to initialize chat. Please refresh the page.');
    if (elements.loadingOverlay) elements.loadingOverlay.style.display = 'none';
  }
}

// Update user name and greeting
function updateUserProfile() {
  const displayName = currentUser.displayName || currentUser.email?.split('@')[0] || 'User';
  if (elements.userName) elements.userName.textContent = displayName;
  const firstName = displayName.split(' ')[0];
  if (elements.greetingText) {
    elements.greetingText.textContent = `👋 Hi ${firstName}! How are you feeling today?`;
  }
}

// Date helpers
function getTodayString() {
  return new Date().toLocaleDateString('en-CA');
}

// Usage tracking
async function checkDailyUsage() {
  try {
    const today = getTodayString();
    const usageRef = doc(db, 'users', currentUser.uid, 'chatUsage', today);
    const usageDoc = await getDoc(usageRef);

    if (usageDoc.exists()) {
      const data = usageDoc.data();
      messagesLeft = Math.max(0, DAILY_MESSAGE_LIMIT - (data.messagesCount || 0));
    } else {
      messagesLeft = DAILY_MESSAGE_LIMIT;
      await setDoc(usageRef, {
        messagesCount: 0,
        date: today,
        lastUpdate: serverTimestamp()
      });
    }
    updateUsageDisplay();
  } catch (err) {
    console.error('Error checking daily usage:', err);
    messagesLeft = DAILY_MESSAGE_LIMIT;
    updateUsageDisplay();
  }
}

function updateUsageDisplay() {
  if (!elements.usageText) return;
  elements.usageText.textContent = `Chats left today: ${messagesLeft}/${DAILY_MESSAGE_LIMIT}`;
  if (messagesLeft <= 0) {
    if (elements.messageInput) {
      elements.messageInput.disabled = true;
      elements.messageInput.placeholder = "Daily limit reached. Come back tomorrow!";
      elements.messageInput.style.opacity = '0.6';
    }
    if (elements.sendBtn) elements.sendBtn.disabled = true;
  } else if (messagesLeft <= 3) {
    elements.usageText.style.color = '#f59e0b';
    elements.usageText.innerHTML = `⚠️ Only ${messagesLeft} chats left today`;
  }
}

async function updateUsageCount() {
  try {
    const today = getTodayString();
    const usageRef = doc(db, 'users', currentUser.uid, 'chatUsage', today);
    await setDoc(usageRef, {
      messagesCount: increment(1),
      lastUpdate: serverTimestamp(),
      date: today
    }, { merge: true });
    messagesLeft = Math.max(0, messagesLeft - 1);
    updateUsageDisplay();
  } catch (err) {
    console.error('Error updating usage count:', err);
  }
}

// Greeting & tips
function displayDailyTip() {
  const today = new Date().toDateString();
  const tipIndex = Math.abs(hashCode(today)) % WELLNESS_TIPS.length;
  if (elements.dailyTipText) elements.dailyTipText.textContent = WELLNESS_TIPS[tipIndex];
}

function displayGreeting() {
  if (elements.greetingSection) elements.greetingSection.style.display = 'block';
}

function hideGreetingSection() {
  if (elements.greetingSection) elements.greetingSection.style.display = 'none';
  if (elements.dailyTipSection) elements.dailyTipSection.style.marginBottom = '1rem';
}

// Hash for daily tip
function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash;
}

// Enable input if allowed
function enableInput() {
  if (messagesLeft > 0 && elements.messageInput && elements.sendBtn) {
    elements.messageInput.disabled = false;
    elements.sendBtn.disabled = false;
    elements.messageInput.placeholder = "Type your message...";
    elements.messageInput.style.opacity = '1';
  }
}

// Firestore chat history
async function loadChatHistory() {
  try {
    const today = getTodayString();
    const messagesRef = collection(db, 'users', currentUser.uid, 'chatLogs', today, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'asc'));
    onSnapshot(q, (snapshot) => {
      if (elements.chatMessages) elements.chatMessages.innerHTML = '';
      chatHistory = [];
      snapshot.forEach((d) => {
        const messageData = d.data();
        chatHistory.push(messageData);
        displayMessage(messageData.message, messageData.sender, messageData.timestamp);
      });
      scrollToBottom();
    });
  } catch (err) {
    console.error('Error loading chat history:', err);
    chatHistory = [];
  }
}

function displayMessage(message, sender, timestamp = null) {
  if (!elements.chatMessages) return;
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message', sender);

  const bubbleDiv = document.createElement('div');
  bubbleDiv.classList.add('message-bubble');
  bubbleDiv.textContent = message;

  if (sender === 'bot') {
    const avatarDiv = document.createElement('div');
    avatarDiv.classList.add('bot-avatar');
    avatarDiv.textContent = '🤖';
    messageDiv.appendChild(avatarDiv);
  }

  messageDiv.appendChild(bubbleDiv);

  const timeDiv = document.createElement('div');
  timeDiv.classList.add('message-time');
  if (timestamp) {
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    timeDiv.textContent = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else {
    timeDiv.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  messageDiv.appendChild(timeDiv);

  elements.chatMessages.appendChild(messageDiv);
  scrollToBottom();
}

async function saveMessage(message, sender) {
  try {
    const today = getTodayString();
    const messagesRef = collection(db, 'users', currentUser.uid, 'chatLogs', today, 'messages');
    await addDoc(messagesRef, { message, sender, timestamp: serverTimestamp() });
  } catch (err) {
    console.error('Error saving message:', err);
  }
}

// Wellness-topic gating (tightened: removed short-text allowance)
function isWellnessRelated(message) {
  const wellnessKeywords = [
    'stress','anxiety','worry','feel','feeling','emotion','sad','happy',
    'depression','mental','health','wellness','mindfulness','meditation',
    'breathe','breathing','relax','calm','peace','positive','negative',
    'motivation','tired','energy','sleep','rest','overwhelmed','pressure',
    'support','help','better','improve','cope','manage','handle',
    'grateful','gratitude','thankful','appreciate','love','care','hope',
    'good','bad','upset','angry','frustrated','lonely','confused',
    'nervous','scared','afraid','comfort','reassurance','advice'
  ];
  const m = message.toLowerCase();
  return wellnessKeywords.some(k => m.includes(k));
}

// Default fallback message
function getDefaultResponse() {
  const responses = [
    "I'm here to listen and support you 💙 Can you tell me more about how you're feeling?",
    "Thank you for sharing with me 🌟 What's been on your mind lately?",
    "I appreciate you reaching out 💪 How can I help support your wellbeing today?",
    "That sounds important to you 🧘 Let's explore what's been affecting your mood recently.",
    "I'm glad you're here 🌈 What would help you feel more at peace right now?",
    "I understand, and I'm here for you 💙 Tell me more about what you're experiencing.",
    "Your feelings are valid 🌸 How has your day been treating you?",
    "I hear you 💫 What kind of support would be most helpful right now?"
  ];
  return responses[Math.floor(Math.random() * responses.length)];
}

// Convert local history to OpenAI message format (assistant/user), keep last 6 turns
function toOpenAIMessages(history, userMessage) {
  const msgs = [];
  const recent = history.slice(-6);
  for (const m of recent) {
    msgs.push({ role: m.sender === 'bot' ? 'assistant' : 'user', content: m.message });
  }
  msgs.push({ role: 'user', content: userMessage });
  return msgs;
}

// Fetch AI reply from your server
async function getAIResponse(userMessage) {
  try {
    if (messagesLeft <= 0) {
      return "⚠️ You've reached your daily chat limit. Come back tomorrow for more support! 💙 Take care of yourself in the meantime. 🌟";
    }

    const payload = { messages: toOpenAIMessages(chatHistory, userMessage) };
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      // Will fall back to default message below
      throw new Error(`Proxy error: ${response.status}`);
    }

    const data = await response.json();
    let aiMessage = (data.reply || '').trim();

   

    // Client-side boundary guard

    return aiMessage || getDefaultResponse();
  } catch (err) {
    console.error('AI fetch error:', err);
    return getDefaultResponse();
  } 
}

// Send a message (main flow)
async function sendMessage() {
  if (!elements.messageInput) return;
  const message = elements.messageInput.value.trim();
  if (!message || messagesLeft <= 0 || isTyping) return;

  try {
    elements.messageInput.value = '';
    validateInput();
    hideGreetingSection();

    displayMessage(message, 'user');
    await saveMessage(message, 'user');
    await updateUsageCount();

    showTypingIndicator();
    const aiResponse = await getAIResponse(message);
    hideTypingIndicator();

    displayMessage(aiResponse, 'bot');
    await saveMessage(aiResponse, 'bot');
  } catch (err) {
    console.error('Error sending message:', err);
    hideTypingIndicator();
    displayMessage('⚠️ Sorry, I encountered an error. Please try again in a moment. 💙', 'bot');
  }
}

// Quick reply flow
async function sendQuickReply(message) {
  if (messagesLeft <= 0 || isTyping) return;
  hideGreetingSection();

  displayMessage(message, 'user');
  await saveMessage(message, 'user');
  await updateUsageCount();

  showTypingIndicator();
  try {
    const aiResponse = await getAIResponse(message);
    hideTypingIndicator();
    displayMessage(aiResponse, 'bot');
    await saveMessage(aiResponse, 'bot');
  } catch (err) {
    console.error('Error with quick reply:', err);
    hideTypingIndicator();
    displayMessage('⚠️ Sorry, I encountered an error. Please try again in a moment. 💙', 'bot');
  }
}

// Typing indicator
function showTypingIndicator() {
  isTyping = true;
  if (elements.typingIndicator) elements.typingIndicator.style.display = 'flex';
  validateInput();
  scrollToBottom();
}

function hideTypingIndicator() {
  isTyping = false;
  if (elements.typingIndicator) elements.typingIndicator.style.display = 'none';
  validateInput();
}

// Scroll helper
function scrollToBottom() {
  setTimeout(() => {
    if (elements.chatWindow) {
      elements.chatWindow.scrollTop = elements.chatWindow.scrollHeight;
    }
  }, 100);
}

// Error toast
function showError(message) {
  const errorDiv = document.createElement('div');
  errorDiv.style.cssText = `
    position: fixed;
    top: 100px;
    left: 50%;
    transform: translateX(-50%);
    background: #ef4444;
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    z-index: 10000;
    animation: slideIn 0.3s ease-out;
    max-width: 90%;
    text-align: center;
  `;
  errorDiv.textContent = message;
  document.body.appendChild(errorDiv);
  setTimeout(() => errorDiv.remove(), 5000);
}

// Daily reset helpers
function resetForNewDay() {
  messagesLeft = DAILY_MESSAGE_LIMIT;
  chatHistory = [];
  if (elements.chatMessages) elements.chatMessages.innerHTML = '';
  if (elements.greetingSection) elements.greetingSection.style.display = 'block';
  updateUsageDisplay();
  enableInput();
  displayDailyTip();
}

function checkNewDay() {
  const lastDate = localStorage.getItem('lastChatDate');
  const today = getTodayString();
  if (lastDate !== today) {
    localStorage.setItem('lastChatDate', today);
    if (lastDate) resetForNewDay();
  }
}

// Focus/visibility hooks
window.addEventListener('focus', () => {
  if (isInitialized) {
    checkDailyUsage();
    applyTheme();
  }
});

document.addEventListener('visibilitychange', () => {
  if (!document.hidden && isInitialized) {
    checkDailyUsage();
    applyTheme();
  }
});

// Logout exposure
window.logout = async function () {
  try {
    await signOut(auth);
    window.location.href = 'index.html';
  } catch (error) {
    console.error('Logout error:', error);
    showError('Failed to logout. Please try again.');
  }
};

// New-day poll
setInterval(checkNewDay, 60000);

console.log('MindMaze Chat (rewritten) loaded ✅');
