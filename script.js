// ============================
// Brightwood Academy Main Script
// ============================

document.addEventListener('DOMContentLoaded', function () {
    console.log('Brightwood Academy website loaded successfully!');

    initializeNavigation();
    initializeFormHandling();
    initializeAnimations();
    initializeScrollEffects();
    initializePhoneFormatting();
});

// -----------------------------
// Navigation Functionality
// -----------------------------
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    const navbar = document.querySelector('.navbar');

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (!targetSection) return;

            const navbarHeight = navbar.offsetHeight;
            const targetPosition = targetSection.offsetTop - navbarHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });

            // Close mobile menu if open
            const navbarCollapse = document.querySelector('.navbar-collapse');
            if (navbarCollapse?.classList.contains('show')) {
                new bootstrap.Collapse(navbarCollapse).hide();
            }
        });
    });

    window.addEventListener('scroll', debounce(updateActiveNavLink, 50));
}

// Highlight active nav link
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 0;

    let currentSection = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - navbarHeight - 100;
        const sectionHeight = section.offsetHeight;
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.id;
        }
    });

    navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${currentSection}`);
    });
}

// -----------------------------
// Form Handling
// -----------------------------
function initializeFormHandling() {
    const form = document.getElementById('admissionForm');
    if (!form) return;

    form.addEventListener('submit', handleFormSubmission);

    form.querySelectorAll('input, select, textarea').forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
    });
}

function handleFormSubmission(e) {
    e.preventDefault();

    const form = e.target;
    const submitButton = form.querySelector('button[type="submit"]');
    const acknowledgment = document.getElementById('acknowledgmentMessage');
    const formData = new FormData(form);

    if (!validateForm(form)) return;

    // Loading State
    submitButton.disabled = true;
    submitButton.textContent = 'Submitting...';

    setTimeout(() => {
        form.style.display = 'none';
        acknowledgment.classList.remove('d-none');
        acknowledgment.scrollIntoView({ behavior: 'smooth', block: 'center' });

        console.log('Form data:', Object.fromEntries(formData));

        submitButton.disabled = false;
        submitButton.textContent = 'Submit Application';

        showSuccessAnimation();
    }, 2000);
}

// -----------------------------
// Validation
// -----------------------------
function validateForm(form) {
    let valid = true;
    form.querySelectorAll('[required]').forEach(field => {
        if (!validateField({ target: field })) valid = false;
    });
    return valid;
}

function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    let isValid = true;
    let message = '';

    clearFieldError(e);

    if (field.required && !value) {
        message = 'This field is required.';
        isValid = false;
    } else if (field.type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            message = 'Please enter a valid email address.';
            isValid = false;
        }
    } else if (field.type === 'tel') {
        const phoneRegex = /^[\+]?[0-9]{7,15}$/;
        if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
            message = 'Please enter a valid phone number.';
            isValid = false;
        }
    } else if (field.type === 'date' && value) {
        const date = new Date(value);
        const today = new Date();
        const min = new Date(today.getFullYear() - 25, today.getMonth(), today.getDate());
        const max = new Date(today.getFullYear() - 3, today.getMonth(), today.getDate());
        if (date < min || date > max) {
            message = 'Please enter a valid date of birth.';
            isValid = false;
        }
    }

    if (!isValid) showFieldError(field, message);
    return isValid;
}

function showFieldError(field, message) {
    field.classList.add('is-invalid');
    const error = document.createElement('div');
    error.className = 'invalid-feedback';
    error.textContent = message;
    field.parentNode.appendChild(error);
}

function clearFieldError(e) {
    const field = e.target;
    field.classList.remove('is-invalid');
    field.parentNode.querySelector('.invalid-feedback')?.remove();
}

// -----------------------------
// Success Animation
// -----------------------------
function showSuccessAnimation() {
    const msg = document.getElementById('acknowledgmentMessage');
    msg.style.animation = 'fadeInUp 0.8s ease-out';
    createConfetti();
}

function createConfetti() {
    const colors = ['#2c5aa0', '#ffc107', '#28a745', '#dc3545', '#17a2b8'];
    const container = document.createElement('div');
    Object.assign(container.style, {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: '9999'
    });
    document.body.appendChild(container);

    for (let i = 0; i < 50; i++) {
        const piece = document.createElement('div');
        Object.assign(piece.style, {
            position: 'absolute',
            width: '10px',
            height: '10px',
            backgroundColor: colors[Math.floor(Math.random() * colors.length)],
            left: Math.random() * 100 + '%',
            top: '-10px',
            borderRadius: '50%',
            animation: `fall ${Math.random() * 3 + 2}s linear forwards`
        });
        container.appendChild(piece);
    }

    setTimeout(() => container.remove(), 5000);
}

const style = document.createElement('style');
style.textContent = `
@keyframes fall {
    to {
        transform: translateY(100vh) rotate(360deg);
        opacity: 0;
    }
}`;
document.head.appendChild(style);

// -----------------------------
// Animations
// -----------------------------
function initializeAnimations() {
    const animateOnScroll = () => {
        document.querySelectorAll('.card, .faculty-card, .table').forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight - 150) el.classList.add('fade-in-up');
        });
    };
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll();
}

// -----------------------------
// Scroll Effects (Navbar + Hero)
// -----------------------------
// -----------------------------
// Scroll Effects (Navbar + Hero)
// -----------------------------
function initializeScrollEffects() {
    const navbar = document.querySelector('.navbar');
    const hero = document.querySelector('.hero-section');

    // ❌ Scroll background change removed for transparent + blurry navbar
    // window.addEventListener('scroll', () => {
    //     if (window.scrollY > 50) {
    //         navbar.style.backgroundColor = 'rgba(44, 90, 160, 0.95)';
    //         navbar.style.backdropFilter = 'blur(10px)';
    //     } else {
    //         navbar.style.backgroundColor = 'var(--primary-color)';
    //         navbar.style.backdropFilter = 'none';
    //     }

    //     if (hero) {
    //         hero.style.transform = `translateY(${window.pageYOffset * -0.5}px)`;
    //     }
    // });

    // ✅ Always keep navbar transparent + blurry (even on scroll)
    navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
    navbar.style.backdropFilter = 'blur(10px)';
    navbar.style.webkitBackdropFilter = 'blur(10px)';

    // ✅ Keep hero parallax effect only (optional)
    window.addEventListener('scroll', () => {
        if (hero) {
            hero.style.transform = `translateY(${window.pageYOffset * -0.5}px)`;
        }
    });
}


// -----------------------------
// Phone Number Formatting
// -----------------------------
function initializePhoneFormatting() {
    const phoneField = document.getElementById('contactNumber');
    if (!phoneField) return;

    phoneField.addEventListener('input', e => {
        e.target.value = formatPhoneNumber(e.target.value);
    });
}

function formatPhoneNumber(value) {
    const num = value.replace(/\D/g, '');
    if (num.length < 4) return num;
    if (num.length < 7) return `(${num.slice(0, 3)}) ${num.slice(3)}`;
    return `(${num.slice(0, 3)}) ${num.slice(3, 6)}-${num.slice(6, 10)}`;
}

// -----------------------------
// Utility: Debounce Function
// -----------------------------
function debounce(func, delay = 100) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), delay);
    };
}

// -----------------------------
// Page Load Event
// -----------------------------
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    console.log('All resources loaded successfully!');
});
