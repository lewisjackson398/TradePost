// DOM Elements
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const contactForm = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');

// Mobile Menu Toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth Scrolling for Navigation Links
navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 70; // Account for fixed navbar
            
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Function to send email via Formspree (backup method)
function sendViaFormspree(name, email, subject, message) {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('subject', subject);
    formData.append('message', message);
    formData.append('_replyto', email);
    formData.append('_subject', `New Contact Form Submission - ${subject}`);
    
    // Using Formspree endpoint
    fetch('https://formspree.io/f/mnnbzbdn', {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => {
        console.log('Formspree response:', response);
        if (response.ok) {
            console.log('Email sent successfully via Formspree');
        } else {
            console.log('Formspree error:', response.status);
        }
    })
    .catch(error => {
        console.error('Formspree error:', error);
    });
}

// Contact Form Handling - Enhanced with Logging
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const name = formData.get('name');
        const email = formData.get('email');
        const subject = formData.get('subject');
        const message = formData.get('message');
        
        // Log form submission for debugging
        console.log('Form submitted with data:', { name, email, subject, message });
        
        // Simple validation
        if (name && email && subject && message) {
            // Create email content
            const emailSubject = `New Contact Form Submission - ${subject}`;
            const emailBody = `You have received a new message from your TradePost website contact form.

From: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}

---
This message was sent from your TradePost website contact form.`;

            // Log the email content
            console.log('Email subject:', emailSubject);
            console.log('Email body:', emailBody);
            
            // Create mailto link
            const mailtoLink = `mailto:lewisjackson398@gmail.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
            
            console.log('Mailto link:', mailtoLink);
            
            // Try to open email client
            try {
                window.location.href = mailtoLink;
                console.log('Email client opened successfully');
                
                // Also try to send via Formspree as backup
                sendViaFormspree(name, email, subject, message);
                
            } catch (error) {
                console.error('Error opening email client:', error);
                alert('There was an error opening your email client. Please copy this information and email it to lewisjackson398@gmail.com:\n\n' + emailBody);
            }
            
            // Show success message
            formSuccess.classList.remove('hidden');
            
            // Reset form
            this.reset();
            
            // Hide success message after 5 seconds
            setTimeout(() => {
                formSuccess.classList.add('hidden');
            }, 5000);
        } else {
            console.log('Form validation failed - missing required fields');
        }
    });
}

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
        }
    });
}, observerOptions);

// Observe all sections for animation
document.querySelectorAll('section, .hero').forEach(section => {
    observer.observe(section);
});

// Add active state to navigation links based on scroll position
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id], header[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Enhanced form validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Add real-time validation feedback
if (contactForm) {
    const emailInput = document.getElementById('email');
    const nameInput = document.getElementById('name');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');
    
    // Email validation
    emailInput.addEventListener('blur', () => {
        if (emailInput.value && !validateEmail(emailInput.value)) {
            emailInput.style.borderColor = '#ef4444';
            emailInput.setCustomValidity('Please enter a valid email address');
        } else {
            emailInput.style.borderColor = '#e5e7eb';
            emailInput.setCustomValidity('');
        }
    });
    
    // Name validation
    nameInput.addEventListener('blur', () => {
        if (nameInput.value && nameInput.value.trim().length < 2) {
            nameInput.style.borderColor = '#ef4444';
            nameInput.setCustomValidity('Name must be at least 2 characters long');
        } else {
            nameInput.style.borderColor = '#e5e7eb';
            nameInput.setCustomValidity('');
        }
    });
    
    // Subject validation
    subjectInput.addEventListener('blur', () => {
        if (subjectInput.value && subjectInput.value.trim().length < 5) {
            subjectInput.style.borderColor = '#ef4444';
            subjectInput.setCustomValidity('Subject must be at least 5 characters long');
        } else {
            subjectInput.style.borderColor = '#e5e7eb';
            subjectInput.setCustomValidity('');
        }
    });
    
    // Message validation
    messageInput.addEventListener('blur', () => {
        if (messageInput.value && messageInput.value.trim().length < 10) {
            messageInput.style.borderColor = '#ef4444';
            messageInput.setCustomValidity('Message must be at least 10 characters long');
        } else {
            messageInput.style.borderColor = '#e5e7eb';
            messageInput.setCustomValidity('');
        }
    });
}

// Smooth reveal animation for service cards
const serviceCards = document.querySelectorAll('.service-card');
serviceCards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    
    setTimeout(() => {
        card.style.transition = 'all 0.6s ease';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
    }, index * 200);
});

// Add loading state to submit button
if (contactForm) {
    const submitButton = contactForm.querySelector('.submit-button');
    
    contactForm.addEventListener('submit', function() {
        const buttonText = submitButton.querySelector('span');
        const buttonIcon = submitButton.querySelector('svg');
        
        buttonText.textContent = 'Sending...';
        submitButton.disabled = true;
        
        // Simulate form processing
        setTimeout(() => {
            buttonText.textContent = 'Message Sent!';
            submitButton.style.background = '#10b981';
            
            setTimeout(() => {
                buttonText.textContent = 'Send Message';
                submitButton.style.background = '#1e40af';
                submitButton.disabled = false;
            }, 2000);
        }, 1000);
    });
}

// Keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Close mobile menu if open
        if (navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    }
});

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

// Apply debouncing to scroll events
const debouncedScrollHandler = debounce(() => {
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
}, 10);

window.addEventListener('scroll', debouncedScrollHandler);

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    // Add fade-in animation to hero content
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.opacity = '0';
        heroContent.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            heroContent.style.transition = 'all 0.8s ease';
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }, 300);
    }
    
    // Add fade-in animation to hero image
    const heroImage = document.querySelector('.hero-image');
    if (heroImage) {
        heroImage.style.opacity = '0';
        heroImage.style.transform = 'translateX(30px)';
        
        setTimeout(() => {
            heroImage.style.transition = 'all 0.8s ease';
            heroImage.style.opacity = '1';
            heroImage.style.transform = 'translateX(0)';
        }, 500);
    }
    
    console.log('TradePost.uk website loaded successfully!');
});
