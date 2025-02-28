// API Endpoints
const login_post_api = "http://localhost:8000/api/login";
const sign_up_api = "http://localhost:8000/api/signup";

// Show authentication popup
function showAuthPopup(mode) {
    document.getElementById('authOverlay').style.display = 'flex';
    switchAuth(mode);
}

// Hide authentication popup
function hideAuthPopup() {
    document.getElementById('authOverlay').style.display = 'none';
}

// Switch between login and signup forms
function switchAuth(mode) {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const loginTab = document.getElementById('loginTab');
    const signupTab = document.getElementById('signupTab');

    if (mode === 'login') {
        loginForm.style.display = 'flex';
        signupForm.style.display = 'none';
        loginTab.classList.add('active');
        signupTab.classList.remove('active');
    } else {
        loginForm.style.display = 'none';
        signupForm.style.display = 'flex';
        loginTab.classList.remove('active');
        signupTab.classList.add('active');
    }
}

// Login handler
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch(login_post_api, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            const data = await response.json();
            currentUser = { 
                ...data.user,
                token: data.access_token
            };
            localStorage.setItem('currentUser', JSON.stringify(currentUser)); // Store
            updateUIForLoggedInUser(currentUser);
            hideAuthPopup();
        } else {
            const errorData = await response.json();
            alert(errorData.detail || 'Login failed. Please check your credentials.');
        }
    } catch (error) {
        console.error("Login Failed:", error);
        alert('Login failed. Please try again.');
    }
});

// Signup handler
document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('signup_email').value;
    const username = document.getElementById('signup_username').value;
    const password = document.getElementById('signup_password').value;
    const confirm_password = document.getElementById('confirm_password').value;

    try {
        const response = await fetch(sign_up_api, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, username, password, confirm_password }),
        });

        if (response.ok) {
            const data = await response.json();
            currentUser = {
                ...data.user,
                token: data.access_token
            };
            localStorage.setItem('currentUser', JSON.stringify(currentUser)); // Store
            updateUIForLoggedInUser(currentUser);
            hideAuthPopup();
        } else {
            const errorData = await response.json();
            alert(errorData.detail || 'Signup failed. Please try again.');
        }
    } catch (error) {
        console.error('Signup error:', error);
        alert('Signup failed. Please try again.');
    }
});

// Close popup when clicking outside
document.getElementById('authOverlay').addEventListener('click', (e) => {
    if (e.target === document.getElementById('authOverlay')) {
        hideAuthPopup();
    }
});

// Update UI for logged-in user
function updateUIForLoggedInUser(user) {
    const authButton = document.querySelector('.button-3');
    authButton.textContent = `${user.username}, Logout`;
    authButton.onclick = logout;

    const addEventButton = document.querySelector('.add-event-btn');
    if (addEventButton) {
        addEventButton.style.display = 'block';
    }

    // Add these lines to open the sidebar
    const sidebar = document.querySelector('.events-sidebar');
    const menuToggle = document.querySelector('.menu-toggle');
    sidebar.classList.add('active');
    menuToggle.classList.add('active');


    // const logoutBtn = document.createElement('button');
    // logoutBtn.className = 'button-3';
    // logoutBtn.textContent = 'Logout';
    // logoutBtn.onclick = logout;
    // authButton.parentNode.appendChild(logoutBtn);
}

// Logout function
function logout() {
    localStorage.removeItem('currentUser'); //clear
    currentUser = null;
    const authButton = document.querySelector('.button-3');
    authButton.textContent = 'SignIn';
    authButton.onclick = () => showAuthPopup('signup');

    // Hide add event button
    const addEventButton = document.querySelector('.add-event-btn');
    if (addEventButton) {
        addEventButton.style.display = 'none';
    }
    // Remove logout button
    const logoutBtn = authButton.parentNode.querySelector('button:last-child');
    if (logoutBtn && logoutBtn.textContent === 'Logout') {
        logoutBtn.remove();
    }
}

// On page load
let currentUser = JSON.parse(localStorage.getItem('currentUser')); // Restore
if (currentUser){ 
    updateUIForLoggedInUser(currentUser);
}