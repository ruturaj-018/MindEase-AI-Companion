// Theme Management
function initTheme() {
    const savedTheme = localStorage.getItem('mindmaze-theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
}

// Listen for theme changes in localStorage
function watchThemeChanges() {
    window.addEventListener('storage', (e) => {
        if (e.key === 'mindmaze-theme' && e.newValue) {
            document.documentElement.setAttribute('data-theme', e.newValue);
        }
    });
}

// Firebase Auth State Management
import { auth, db } from './firebase-config.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

async function getUserFullName(user) {
    if (!user) return null;
    
    try {
        // Try to get name from Firestore first
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
            const userData = userDoc.data();
            if (userData.name) return userData.name;
            if (userData.displayName) return userData.displayName;
        }
        
        // Fall back to auth displayName
        if (user.displayName) return user.displayName;
        
        // Final fallback
        return 'User';
    } catch (error) {
        console.error('Error fetching user data:', error);
        return user.displayName || 'User';
    }
}

async function updateUIForAuthState(user) {
    const signupBtn = document.getElementById('signup-btn');
    const loginBtn = document.getElementById('login-btn');
    const userChip = document.getElementById('user-chip');
    const userName = document.getElementById('user-name');
    
    if (user) {
        // User is signed in
        const fullName = await getUserFullName(user);
        
        // Update navbar
        signupBtn.classList.add('hidden');
        loginBtn.classList.add('hidden');
        userChip.classList.remove('hidden');
        userName.textContent = fullName;
    } else {
        // User is signed out
        signupBtn.classList.remove('hidden');
        loginBtn.classList.remove('hidden');
        userChip.classList.add('hidden');
    }
}

// Initialize Firebase Auth State Listener
function initAuth() {
    onAuthStateChanged(auth, updateUIForAuthState);
}

// Intersection Observer for Reveal Animations
function initRevealAnimations() {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
        // Immediately show all elements if motion is reduced
        document.querySelectorAll('[data-animate]').forEach(el => {
            el.classList.add('revealed');
        });
        return;
    }
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Add reveal animation to elements with data-animate attribute
    const revealElements = document.querySelectorAll('[data-animate]');
    revealElements.forEach(el => {
        observer.observe(el);
    });
}

// FAQ Toggle Functionality
function initFAQ() {
    const faqButtons = document.querySelectorAll('.faq-button');
    
    faqButtons.forEach(button => {
        button.addEventListener('click', () => {
            const isExpanded = button.getAttribute('aria-expanded') === 'true';
            const panel = button.nextElementSibling;
            
            // Close all other FAQs
            faqButtons.forEach(otherButton => {
                if (otherButton !== button) {
                    otherButton.setAttribute('aria-expanded', 'false');
                    const otherPanel = otherButton.nextElementSibling;
                    otherPanel.classList.remove('open');
                }
            });
            
            // Toggle current FAQ
            button.setAttribute('aria-expanded', !isExpanded);
            panel.classList.toggle('open', !isExpanded);
        });
        
        // Keyboard navigation
        button.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                button.click();
            }
        });
    });
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = target.offsetTop - navbarHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update active nav state
                updateActiveNavLink(this.getAttribute('href').substring(1));
            }
        });
    });
    
    // Initialize scroll-based active state detection
    initScrollActiveState();
}

// Initialize scroll-based active state detection
function initScrollActiveState() {
    const sections = ['about', 'resources', 'support'];
    const navbarHeight = document.querySelector('.navbar').offsetHeight;
    
    const observerOptions = {
        threshold: 0.3,
        rootMargin: `-${navbarHeight + 50}px 0px -50% 0px`
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                updateActiveNavLink(entry.target.id);
            }
        });
    }, observerOptions);
    
    // Observe all sections
    sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
            observer.observe(section);
        }
    });
}

// Update active navigation state based on scroll position
function updateActiveNavLink(activeSection = null) {
    const navLinks = document.querySelectorAll('.nav-link[data-nav]');
    const sections = ['about', 'resources', 'support'];
    
    if (activeSection) {
        // Manually set active section
        navLinks.forEach(link => {
            if (link.dataset.nav === activeSection) {
                link.setAttribute('aria-current', 'page');
            } else {
                link.removeAttribute('aria-current');
            }
        });
        return;
    }
    
    // Auto-detect based on scroll position
    const navbarHeight = document.querySelector('.navbar').offsetHeight;
    const scrollPosition = window.scrollY + navbarHeight + 100;
    
    let currentSection = '';
    
    sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section && scrollPosition >= section.offsetTop) {
            currentSection = sectionId;
        }
    });
    
    navLinks.forEach(link => {
        if (link.dataset.nav === currentSection) {
            link.setAttribute('aria-current', 'page');
        } else {
            link.removeAttribute('aria-current');
        }
    });
}

// Navbar scroll effect
function initNavbarScrollEffect() {
    const navbar = document.querySelector('.navbar');
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            navbar.style.backdropFilter = 'blur(20px)';
            navbar.style.boxShadow = '0 4px 16px var(--shadow)';
        } else {
            navbar.style.backdropFilter = 'blur(10px)';
            navbar.style.boxShadow = '0 2px 8px var(--shadow)';
        }
        
        lastScrollY = currentScrollY;
        
        // Update active nav link based on scroll position
        updateActiveNavLink();
    });
}

// Feedback form handling
function initFeedbackForm() {
    const form = document.getElementById('feedbackForm');
    const submitBtn = form.querySelector('.feedback-submit');
    const statusDiv = document.getElementById('feedbackStatus');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const data = {
            name: formData.get('name') || '',
            email: formData.get('email') || '',
            message: formData.get('message')
        };
        
        // Basic validation
        if (!data.message.trim()) {
            showFeedbackStatus('Please enter a message.', 'error');
            return;
        }
        
        // Show loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 700));
            
            // Log to console (no database write as requested)
            console.log('Feedback submitted:', data);
            
            // Show success state
            submitBtn.classList.remove('loading');
            submitBtn.classList.add('success');
            
            // Show success message
            showFeedbackStatus('Thank you for your feedback! We\'ll review it and get back to you soon.', 'success');
            
            // Reset form after a delay
            setTimeout(() => {
                form.reset();
                submitBtn.classList.remove('success');
                submitBtn.disabled = false;
                statusDiv.hidden = true;
            }, 3000);
            
        } catch (error) {
            console.error('Feedback submission error:', error);
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
            showFeedbackStatus('Sorry, something went wrong. Please try again.', 'error');
        }
    });
}

function showFeedbackStatus(message, type) {
    const statusDiv = document.getElementById('feedbackStatus');
    statusDiv.textContent = message;
    statusDiv.className = `feedback-status ${type}`;
    statusDiv.hidden = false;
}

// Form validation helpers (for future use)
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Error handling for Firebase operations
function handleFirebaseError(error) {
    console.error('Firebase error:', error);
    
    // You could show a user-friendly message here
    const errorMessages = {
        'auth/user-not-found': 'No account found with this email.',
        'auth/wrong-password': 'Incorrect password.',
        'auth/email-already-in-use': 'An account already exists with this email.',
        'auth/weak-password': 'Password should be at least 6 characters.',
        'auth/invalid-email': 'Please enter a valid email address.',
        'auth/network-request-failed': 'Network error. Please check your connection.',
    };
    
    return errorMessages[error.code] || 'An unexpected error occurred. Please try again.';
}

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Lazy loading for images
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// Keyboard navigation improvements
function initKeyboardNavigation() {
    // Skip to main content link
    const skipLink = document.createElement('a');
    skipLink.href = '#main';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'sr-only';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: var(--primary);
        color: white;
        padding: 8px;
        z-index: 1001;
        text-decoration: none;
        border-radius: 4px;
        transition: top 0.2s;
    `;
    
    skipLink.addEventListener('focus', () => {
        skipLink.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add main id to main element
    const main = document.querySelector('main');
    if (main) main.id = 'main';
}

// Performance monitoring
function initPerformanceMonitoring() {
    // Log Core Web Vitals
    if ('PerformanceObserver' in window) {
        try {
            const observer = new PerformanceObserver((list) => {
                list.getEntries().forEach((entry) => {
                    if (entry.entryType === 'largest-contentful-paint') {
                        console.log('LCP:', entry.startTime);
                    }
                    if (entry.entryType === 'first-input') {
                        console.log('FID:', entry.processingStart - entry.startTime);
                    }
                    if (entry.entryType === 'layout-shift') {
                        if (!entry.hadRecentInput) {
                            console.log('CLS:', entry.value);
                        }
                    }
                });
            });
            
            observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
        } catch (e) {
            console.log('Performance monitoring not supported');
        }
    }
}

// Main initialization function
function init() {
    // Theme
    initTheme();
    watchThemeChanges();
    
    // Firebase Auth
    initAuth();
    
    // Animations and interactions
    initRevealAnimations();
    initFeedbackForm();
    initFAQ();
    initSmoothScrolling();
    initNavbarScrollEffect();
    
    // Accessibility
    initKeyboardNavigation();
    
    // Performance
    initLazyLoading();
    initPerformanceMonitoring();
    
    // Add loading complete class for any final animations
    document.addEventListener('DOMContentLoaded', () => {
        document.body.classList.add('loaded');
    });
}

// Error boundary
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
    // Could send to error reporting service here
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
    // Could send to error reporting service here
});

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Export functions for potential external use
export {
    initTheme,
    getUserFullName,
    handleFirebaseError,
    validateEmail,
    debounce,
    updateActiveNavLink,
    showFeedbackStatus
};