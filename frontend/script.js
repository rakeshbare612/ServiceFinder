// ===== Configuration =====
const API_BASE = 'http://localhost:3000/api';
let currentUser = null;
let currentProviderId = null;
let currentLocation = null;
let currentProviderIsDemo = false;
let currentProviderData = null;

// ===== Theme Management =====
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark-mode');
    }
}

function toggleTheme() {
    const isDarkMode = document.documentElement.classList.toggle('dark-mode');
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
}

const demoProfessionals = [
    { id: 'demo-101', actualProviderId: 1, name: 'Amit Sharma', address: 'Dadar, Mumbai', price: 450, rating: 4.8, profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Amit&scale=90', category: 'Plumber', experience: 8, skills: 'Pipe Repair, Leak Fixing, Bathroom Fittings', workerId: 'PLB-101', phone: '+91 98765 43210', portfolio_images: ['https://images.unsplash.com/photo-1585771724684-38269d6639c9?w=400', 'https://images.unsplash.com/photo-1585771724684-38269d6639c9?w=400&q=50', 'https://images.unsplash.com/photo-1536622335107-c8ab7db4dff6?w=400'] },
    { id: 'demo-102', actualProviderId: 2, name: 'Nisha Patel', address: 'Pune, Maharashtra', price: 420, rating: 4.7, profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nisha&scale=90', category: 'Painter', experience: 6, skills: 'Interior Painting, Texture Work, Color Matching', workerId: 'PNT-102', phone: '+91 99876 54321', portfolio_images: ['https://images.unsplash.com/photo-1589939705066-5470d7b23b0d?w=400', 'https://images.unsplash.com/photo-1589939705066-5470d7b23b0d?w=400&q=50'] },
    { id: 'demo-103', actualProviderId: 3, name: 'Raj Verma', address: 'Thane, Maharashtra', price: 500, rating: 4.9, profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Raj&scale=90', category: 'Electrician', experience: 10, skills: 'Wiring Repair, Switchboard, Lighting Installation', workerId: 'ELC-103', phone: '+91 91234 56789', portfolio_images: ['https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400', 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&q=50', 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&q=80'] },
    { id: 'demo-104', actualProviderId: 4, name: 'Sneha Reddy', address: 'Navi Mumbai', price: 380, rating: 4.6, profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha&scale=90', category: 'Carpenter', experience: 7, skills: 'Furniture Repair, Woodwork, Custom Shelves', workerId: 'CRP-104', phone: '+91 90123 45678', portfolio_images: ['https://images.unsplash.com/photo-1513828583688-c52646db42da?w=400', 'https://images.unsplash.com/photo-1513828583688-c52646db42da?w=400&q=50'] },
    { id: 'demo-105', actualProviderId: 5, name: 'Vikram Joshi', address: 'Nagpur, Maharashtra', price: 470, rating: 4.7, profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram&scale=90', category: 'Appliance Repair', experience: 9, skills: 'Fridge, Washing Machine, Oven Repair', workerId: 'APR-105', phone: '+91 90234 56781', portfolio_images: ['https://images.unsplash.com/photo-1585771724684-38269d6639c9?w=400'] },
    { id: 'demo-106', actualProviderId: 6, name: 'Sonal Mehta', address: 'Bandra, Mumbai', price: 525, rating: 4.9, profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sonal&scale=90', category: 'AC Technician', experience: 11, skills: 'AC Install, Gas Refill, Service', workerId: 'AC-106', phone: '+91 91456 78902', portfolio_images: ['https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400', 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&q=60'] },
    { id: 'demo-107', actualProviderId: 7, name: 'Manoj Singh', address: 'Andheri, Mumbai', price: 410, rating: 4.6, profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Manoj&scale=90', category: 'Home Cleaning', experience: 5, skills: 'Deep Cleaning, Sofa Cleaning, Kitchen Sanitation', workerId: 'HCL-107', phone: '+91 92567 89013', portfolio_images: ['https://images.unsplash.com/photo-1585771724684-38269d6639c9?w=400'] },
    { id: 'demo-108', actualProviderId: 8, name: 'Priya Nair', address: 'Kalyan, Maharashtra', price: 390, rating: 4.5, profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya&scale=90', category: 'Furniture Assembly', experience: 6, skills: 'Assembly, Installation, Repair', workerId: 'FUR-108', phone: '+91 93678 90124', portfolio_images: ['https://images.unsplash.com/photo-1513828583688-c52646db42da?w=400'] },
    { id: 'demo-109', actualProviderId: 1, name: 'Rahul Dubey', address: 'Panvel, Maharashtra', price: 460, rating: 4.8, profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul&scale=90', category: 'Roof Repair', experience: 8, skills: 'Leak Fix, Tile Replacement, Waterproofing', workerId: 'RRP-109', phone: '+91 94789 01235', portfolio_images: ['https://images.unsplash.com/photo-1585771724684-38269d6639c9?w=400', 'https://images.unsplash.com/photo-1585771724684-38269d6639c9?w=400&q=50'] },
    { id: 'demo-110', actualProviderId: 2, name: 'Meena Kapoor', address: 'Mulund, Mumbai', price: 430, rating: 4.7, profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Meena&scale=90', category: 'Interior Work', experience: 9, skills: 'Decor, Partition, Lighting Design', workerId: 'INT-110', phone: '+91 95890 12346', portfolio_images: ['https://images.unsplash.com/photo-1589939705066-5470d7b23b0d?w=400', 'https://images.unsplash.com/photo-1589939705066-5470d7b23b0d?w=400&q=50'] }
];

// ===== Initialize App =====
document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    checkAuth();
    setupEventListeners();
    setMinDate();
    renderDemoServices();
    loadServices();

    const initialPage = getPageFromHash(window.location.hash) || 'home';
    navigateTo(initialPage, false);
});

// ===== Event Listeners =====
function setupEventListeners() {
    window.addEventListener('hashchange', () => {
        const page = getPageFromHash(window.location.hash);
        if (page) {
            navigateTo(page, false);
        }
    });
    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = e.target.dataset.page;
            navigateTo(page);
        });
    });

    // Logout
    document.getElementById('logoutNavBtn').addEventListener('click', logout);

    // Login/Register toggle
    document.getElementById('loginToggle').addEventListener('click', toggleLoginForm);
    document.getElementById('registerToggle').addEventListener('click', toggleRegisterForm);

    // Forms
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('registerForm').addEventListener('submit', handleRegister);
    document.getElementById('bookingForm').addEventListener('submit', handleBooking);
    document.getElementById('addWorkerForm').addEventListener('submit', handleAddWorker);

    // Booking
    document.getElementById('shareLocationBtn').addEventListener('click', getLocation);

    // Search
    document.getElementById('searchPlumber').addEventListener('input', handleSearch);

    // Filters
    document.getElementById('priceMin').addEventListener('input', applyFilters);
    document.getElementById('priceMax').addEventListener('input', applyFilters);
    document.getElementById('ratingFilter').addEventListener('change', applyFilters);
    document.getElementById('experienceFilter').addEventListener('change', applyFilters);
    document.getElementById('verifiedFilter').addEventListener('change', applyFilters);
    document.getElementById('resetFiltersBtn').addEventListener('click', resetFilters);

    // Back button
    document.getElementById('backBtn').addEventListener('click', () => navigateTo('home'));

    // Theme toggle
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
}

// ===== Page Navigation =====
function navigateTo(page) {
    if (page === 'login' && currentUser) {
        navigateTo('home');
        return;
    }

    if ((page === 'bookings' || page === 'details' || page === 'workerDashboard' || page === 'adminDashboard') && !currentUser) {
        showToast('Please login first', 'error');
        navigateTo('login');
        return;
    }

    if (page === 'adminDashboard' && currentUser && currentUser.role !== 'admin') {
        showToast('Admin access required', 'error');
        navigateTo('home');
        return;
    }

    // Hide all pages
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

    // Show selected page
    if (page === 'home') {
        document.getElementById('home-page').classList.add('active');
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        document.querySelector('[data-page="home"]').classList.add('active');
    } else if (page === 'login') {
        document.getElementById('login-page').classList.add('active');
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        document.querySelector('[data-page="login"]').classList.add('active');
    } else if (page === 'profile') {
        document.getElementById('profile-page').classList.add('active');
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        document.querySelector('[data-page="profile"]').classList.add('active');
        populateProfilePage();
    } else if (page === 'workerDashboard') {
        document.getElementById('worker-dashboard-page').classList.add('active');
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        document.querySelector('[data-page="workerDashboard"]').classList.add('active');
        loadWorkerDashboard();
    } else if (page === 'adminDashboard') {
        document.getElementById('admin-dashboard-page').classList.add('active');
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        document.querySelector('[data-page="adminDashboard"]').classList.add('active');
        loadAdminDashboard();
    } else if (page === 'details') {
        document.getElementById('details-page').classList.add('active');
        loadProviderDetails();
    } else if (page === 'bookings') {
        document.getElementById('bookings-page').classList.add('active');
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        document.querySelector('[data-page="bookings"]').classList.add('active');
        loadBookings();
    }
}

function updatePageHash(page) {
    const pageMap = {
        home: 'home',
        login: 'login',
        profile: 'profile',
        workerDashboard: 'dashboard',
        adminDashboard: 'admin',
        details: 'details',
        bookings: 'bookings'
    };

    const hash = pageMap[page] ? `#${pageMap[page]}` : '#home';
    if (window.location.hash !== hash) {
        window.location.hash = hash;
    }
}

function getPageFromHash(hash) {
    const page = hash.replace('#', '');
    switch (page) {
        case 'home':
        case 'login':
        case 'profile':
        case 'bookings':
        case 'details':
            return page;
        case 'dashboard':
            return 'workerDashboard';
        case 'admin':
            return 'adminDashboard';
        default:
            return 'home';
    }
}

// ===== Authentication =====
function checkAuth() {
    const user = localStorage.getItem('user');
    if (user) {
        currentUser = JSON.parse(user);
        if (currentUser.provider_id && !currentUser.providerId) {
            currentUser.providerId = currentUser.provider_id;
        }
        updateAuthUI();
    }
}

function updateAuthUI() {
    if (currentUser) {
        document.getElementById('loginNavBtn').style.display = 'none';
        document.getElementById('logoutNavBtn').style.display = 'block';

        if (currentUser.role === 'worker') {
            document.getElementById('profileNavBtn').style.display = 'none';
            document.getElementById('workerNavBtn').style.display = 'block';
            document.getElementById('adminNavBtn').style.display = 'none';
            document.getElementById('bookingsNavBtn').style.display = 'none';
        } else if (currentUser.role === 'admin') {
            document.getElementById('profileNavBtn').style.display = 'none';
            document.getElementById('workerNavBtn').style.display = 'none';
            document.getElementById('adminNavBtn').style.display = 'block';
            document.getElementById('bookingsNavBtn').style.display = 'none';
        } else {
            document.getElementById('profileNavBtn').style.display = 'block';
            document.getElementById('bookingsNavBtn').style.display = 'block';
            document.getElementById('workerNavBtn').style.display = 'none';
            document.getElementById('adminNavBtn').style.display = 'none';
        }
    } else {
        document.getElementById('loginNavBtn').style.display = 'block';
        document.getElementById('profileNavBtn').style.display = 'none';
        document.getElementById('workerNavBtn').style.display = 'none';
        document.getElementById('bookingsNavBtn').style.display = 'none';
        document.getElementById('logoutNavBtn').style.display = 'none';
    }
}

function populateProfilePage() {
    if (!currentUser) {
        return;
    }

    document.getElementById('profileUserName').textContent = currentUser.name || 'User Name';
    document.getElementById('profileUserEmail').textContent = currentUser.email || 'user@example.com';
    document.getElementById('profileAvatar').src = currentUser.profileImage || 'https://i.pravatar.cc/150?img=12';
    document.getElementById('profileTotalBookings').textContent = '0';
    document.getElementById('profileViewedProviders').textContent = '8';
    document.getElementById('profileRating').textContent = '4.7★';
    document.getElementById('profileLocation').textContent = 'Maharashtra';
}

function toggleLoginForm() {
    document.getElementById('loginToggle').classList.add('active');
    document.getElementById('registerToggle').classList.remove('active');
    document.getElementById('loginForm').classList.add('active');
    document.getElementById('registerForm').classList.remove('active');
}

function toggleRegisterForm() {
    document.getElementById('registerToggle').classList.add('active');
    document.getElementById('loginToggle').classList.remove('active');
    document.getElementById('registerForm').classList.add('active');
    document.getElementById('loginForm').classList.remove('active');
}

async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            currentUser = data.user;
            localStorage.setItem('user', JSON.stringify(currentUser));
            updateAuthUI();
            document.getElementById('loginForm').reset();
            showToast('Login successful!', 'success');
            if (currentUser.role === 'worker') {
                navigateTo('workerDashboard');
            } else {
                navigateTo('profile');
            }
        } else {
            showToast(data.message || 'Login failed', 'error');
        }
    } catch (error) {
        showToast('Error: ' + error.message, 'error');
    }
}

async function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const role = 'customer';

    const payload = { name, email, password, role };

    try {
        const response = await fetch(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (response.ok) {
            currentUser = data.user;
            localStorage.setItem('user', JSON.stringify(currentUser));
            updateAuthUI();
            document.getElementById('registerForm').reset();
            showToast('Registration successful! Logged in.', 'success');
            if (currentUser.role === 'worker') {
                navigateTo('workerDashboard');
            } else {
                navigateTo('profile');
            }
        } else {
            showToast(data.message || 'Registration failed', 'error');
        }
    } catch (error) {
        showToast('Error: ' + error.message, 'error');
    }
}

function logout() {
    currentUser = null;
    localStorage.removeItem('user');
    updateAuthUI();
    showToast('Logged out successfully', 'success');
    navigateTo('home');
}

// ===== Services/Providers =====
async function loadServices(search = '') {
    try {
        const container = document.getElementById('servicesContainer');
        container.innerHTML = '<div class="loading-spinner"><div class="spinner"></div><p>Loading plumbers...</p></div>';

        let url = `${API_BASE}/services`;
        if (search) {
            url += `?search=${encodeURIComponent(search)}`;
        }

        const response = await fetch(url);
        const data = await response.json();

        if (data.success && data.data.length > 0) {
            container.innerHTML = data.data.map(service => `
                <div class="service-card" data-experience="${service.experience || 0}" data-verified="${service.verified !== false}">
                    <div class="service-card-image">
                        <img src="${service.profileImage}" alt="${service.name}">
                        <span class="service-card-category">${service.category || 'Plumber'}</span>
                    </div>
                    <div class="service-card-content">
                        <h3>${service.name}</h3>
                        <div class="service-card-meta">
                            <span class="service-card-location">
                                <i class="fas fa-map-marker-alt"></i> ${service.address}
                            </span>
                            <span class="service-card-price">₹${service.price}/hr</span>
                        </div>
                        <div class="rating-stars">${generateStars(service.rating)}</div>
                        <div class="service-card-buttons">
                            <button class="btn btn-primary" onclick="viewDetails(${service.id})">
                                View Details
                            </button>
                            <button class="btn btn-secondary" onclick="bookPlumber(${service.id})">
                                Book Now
                            </button>
                        </div>
                    </div>
                </div>
            `).join('');
        } else {
            container.innerHTML = '<p class="no-data">No plumbers found</p>';
        }
    } catch (error) {
        document.getElementById('servicesContainer').innerHTML = '<p class="no-data">Error loading services</p>';
        console.error('Error loading services:', error);
    }
}

function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 !== 0;
    let stars = '';

    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }

    if (hasHalf) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }

    for (let i = fullStars + (hasHalf ? 1 : 0); i < 5; i++) {
        stars += '<i class="far fa-star"></i>';
    }

    return stars;
}

// ===== Reviews System =====
async function loadProviderReviews() {
    try {
        const response = await fetch(`${API_BASE}/reviews/provider/${currentProviderId}`);
        const data = await response.json();

        if (data.success && data.reviews.length > 0) {
            const reviews = data.reviews;
            
            // Calculate average rating
            const avgRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);
            document.getElementById('avgRating').textContent = avgRating;
            document.getElementById('ratingStars').textContent = generateRatingStars(parseFloat(avgRating));
            document.getElementById('reviewCount').textContent = `Based on ${reviews.length} review${reviews.length > 1 ? 's' : ''}`;

            // Rating breakdown
            const breakdown = {
                5: 0, 4: 0, 3: 0, 2: 0, 1: 0
            };
            reviews.forEach(r => breakdown[r.rating]++);

            const breakdownHTML = Object.entries(breakdown)
                .reverse()
                .map(([stars, count]) => {
                    const percentage = (count / reviews.length) * 100;
                    return `
                        <div class="rating-bar">
                            <span class="rating-bar-label">${stars}★</span>
                            <div class="rating-bar-fill">
                                <div class="rating-bar-progress" style="width: ${percentage}%"></div>
                            </div>
                            <span style="min-width: 30px; text-align: right; color: var(--text-light); font-size: 0.85rem;">${count}</span>
                        </div>
                    `;
                }).join('');
            document.getElementById('ratingBreakdown').innerHTML = breakdownHTML;

            // Display reviews
            const reviewsHTML = reviews.map(review => `
                <div class="review-item">
                    <div class="review-header">
                        <div class="reviewer-info">
                            <div class="reviewer-avatar">${review.reviewer_name.charAt(0).toUpperCase()}</div>
                            <div class="reviewer-details">
                                <h5>${review.reviewer_name}</h5>
                                <div class="reviewer-time">${new Date(review.created_at).toLocaleDateString()}</div>
                            </div>
                        </div>
                        <div class="review-stars">${generateRatingStars(review.rating)}</div>
                    </div>
                    <div class="review-comment-text">${review.comment || 'No comment provided'}</div>
                    <div class="review-footer">
                        <button class="helpful-btn" onclick="markReviewHelpful(${review.id})">
                            <i class="fas fa-thumbs-up"></i> Helpful (${review.helpful_count || 0})
                        </button>
                    </div>
                </div>
            `).join('');
            document.getElementById('reviewsList').innerHTML = reviewsHTML;

            // Show review form if user is logged in
            if (currentUser) {
                document.getElementById('reviewFormContainer').style.display = 'block';
                setupReviewForm();
            }
        }
    } catch (error) {
        console.error('Error loading reviews:', error);
    }
}

function generateRatingStars(rating) {
    return '★'.repeat(Math.round(rating)) + '☆'.repeat(5 - Math.round(rating));
}

function setupReviewForm() {
    const ratingInputs = document.querySelectorAll('.star-input');
    let selectedRating = 0;

    ratingInputs.forEach(star => {
        star.addEventListener('click', () => {
            selectedRating = parseInt(star.dataset.rating);
            document.getElementById('selectedRating').value = selectedRating;
            ratingInputs.forEach(s => s.classList.remove('active'));
            for (let i = 0; i < selectedRating; i++) {
                ratingInputs[i].classList.add('active');
            }
        });
    });

    document.getElementById('submitReviewForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!currentUser) {
            showToast('Please login to submit a review', 'error');
            return;
        }

        if (!selectedRating || selectedRating === 0) {
            showToast('Please select a rating', 'error');
            return;
        }

        const comment = document.getElementById('reviewComment').value;

        try {
            const response = await fetch(`${API_BASE}/reviews/submit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    bookingId: 1, // In production, get actual booking ID
                    providerId: currentProviderId,
                    userId: currentUser.id,
                    rating: selectedRating,
                    comment
                })
            });

            const data = await response.json();
            if (response.ok) {
                showToast('Review submitted successfully!', 'success');
                document.getElementById('submitReviewForm').reset();
                ratingInputs.forEach(s => s.classList.remove('active'));
                loadProviderReviews();
            } else {
                showToast(data.message || 'Error submitting review', 'error');
            }
        } catch (error) {
            showToast('Error: ' + error.message, 'error');
        }
    });
}

async function markReviewHelpful(reviewId) {
    try {
        const response = await fetch(`${API_BASE}/reviews/${reviewId}/helpful`, {
            method: 'PUT'
        });

        if (response.ok) {
            loadProviderReviews();
        }
    } catch (error) {
        console.error('Error marking review as helpful:', error);
    }
}

function renderDemoServices() {
    const container = document.getElementById('demoServicesContainer');
    container.innerHTML = demoProfessionals.map(item => `
        <div class="service-card">
            <div class="service-card-image">
                <img src="${item.profileImage}" alt="${item.name}">
            </div>
            <div class="service-card-content">
                <h3>${item.name}</h3>
                <div class="service-card-meta">
                    <span class="service-card-location">
                        <i class="fas fa-map-marker-alt"></i> ${item.address}
                    </span>
                    <span class="service-card-price">₹${item.price}/hr</span>
                </div>
                <div class="service-card-category">${item.category}</div>
                <div class="rating-stars">${generateStars(item.rating)} <span>${item.rating}</span></div>
                <div class="service-card-buttons">
                    <button class="btn btn-primary" onclick="openDemoDetails('${item.id}')">View Details</button>
                    <button class="btn btn-secondary" onclick="openDemoDetails('${item.id}')">Book Now</button>
                </div>
            </div>
        </div>
    `).join('');
}

function openDemoDetails(providerId) {
    const provider = demoProfessionals.find(item => item.id === providerId);
    if (!provider) {
        showToast('Demo details not found', 'error');
        return;
    }

    currentProviderId = provider.actualProviderId || providerId;
    currentProviderIsDemo = true;
    currentProviderData = provider;

    if (!currentUser) {
        showToast('Please login first', 'error');
        navigateTo('login');
        return;
    }

    navigateTo('details');
}

async function viewDetails(providerId) {
    if (!currentUser) {
        showToast('Please login first', 'error');
        navigateTo('login');
        return;
    }
    currentProviderId = providerId;
    currentProviderIsDemo = false;
    currentProviderData = null;
    navigateTo('details');
}

function bookPlumber(providerId) {
    if (!currentUser) {
        showToast('Please login first', 'error');
        navigateTo('login');
        return;
    }
    currentProviderId = providerId;
    currentProviderIsDemo = false;
    currentProviderData = null;
    navigateTo('details');
    // Scroll to booking section
    setTimeout(() => {
        document.querySelector('.booking-section').scrollIntoView({ behavior: 'smooth' });
    }, 100);
}

async function loadProviderDetails() {
    try {
        let provider = null;

        if (currentProviderIsDemo && currentProviderData) {
            provider = currentProviderData;
        } else {
            const response = await fetch(`${API_BASE}/providers/${currentProviderId}`);
            const data = await response.json();
            if (data.success) {
                provider = data.data;
            }
        }

        if (!provider) {
            showToast('Error loading provider details', 'error');
            return;
        }

        // Update main card
        document.getElementById('detailsName').textContent = provider.name;
        document.getElementById('detailsImage').src = provider.profileImage;
        document.getElementById('detailsLocation').textContent = `📍 ${provider.address}`;
        document.getElementById('detailsPrice').textContent = `₹${provider.price}/hour`;
        document.getElementById('detailsRating').innerHTML = generateStars(provider.rating);

        // Update ID Card
        document.getElementById('idName').textContent = provider.name;
        document.getElementById('idWorkerID').textContent = provider.workerId || 'PLB-0000';
        document.getElementById('idPhone').textContent = provider.phone || 'N/A';
        document.getElementById('idAddress').textContent = provider.address;
        document.getElementById('idSkills').textContent = provider.skills || provider.category || 'General service';
        document.getElementById('idExperience').textContent = `${provider.experience || '5'} years`;
        document.getElementById('idPhoto').src = provider.profileImage;

        // Load portfolio gallery
        const portfolioContainer = document.getElementById('portfolioGallery');
        if (provider.portfolio_images && provider.portfolio_images.length > 0) {
            const images = typeof provider.portfolio_images === 'string' 
                ? JSON.parse(provider.portfolio_images) 
                : provider.portfolio_images;
            
            portfolioContainer.innerHTML = images.map((img, index) => `
                <div class="gallery-item" style="animation-delay: ${index * 0.1}s">
                    <img src="${img}" alt="Portfolio ${index + 1}" loading="lazy">
                </div>
            `).join('');
        } else {
            portfolioContainer.innerHTML = '<div class="no-portfolio">No portfolio images available yet</div>';
        }

        // Reset location and form
        currentLocation = null;
        document.getElementById('bookingForm').reset();
        document.getElementById('locationStatus').innerHTML = '';
        document.getElementById('locationStatus').className = '';

        // Load reviews
        loadProviderReviews();
    } catch (error) {
        showToast('Error loading provider details', 'error');
        console.error(error);
    }
}

// ===== Location Handling =====
function getLocation() {
    if (!navigator.geolocation) {
        showToast('Geolocation is not supported', 'error');
        return;
    }

    document.getElementById('shareLocationBtn').disabled = true;
    document.getElementById('shareLocationBtn').textContent = 'Getting location...';

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;

            // Check if location is in Maharashtra (approximate coordinates)
            // Maharashtra bounds: 12.4°N to 22.7°N, 72.6°E to 80.9°E
            if (lat >= 12.4 && lat <= 22.7 && lng >= 72.6 && lng <= 80.9) {
                currentLocation = { latitude: lat, longitude: lng };
                document.getElementById('locationStatus').className = 'success';
                document.getElementById('locationStatus').innerHTML = `
                    <i class="fas fa-check-circle"></i> Location captured! (${lat.toFixed(4)}, ${lng.toFixed(4)})
                `;
                showToast('Location captured successfully', 'success');
            } else {
                document.getElementById('locationStatus').className = 'error';
                document.getElementById('locationStatus').innerHTML = `
                    <i class="fas fa-times-circle"></i> Service only available in Maharashtra
                `;
                showToast('Service only available in Maharashtra', 'error');
            }

            document.getElementById('shareLocationBtn').disabled = false;
            document.getElementById('shareLocationBtn').textContent = '📍 Share Live Location';
        },
        (error) => {
            document.getElementById('locationStatus').className = 'error';
            document.getElementById('locationStatus').innerHTML = `<i class="fas fa-times-circle"></i> ${error.message}`;
            document.getElementById('shareLocationBtn').disabled = false;
            document.getElementById('shareLocationBtn').textContent = '📍 Share Live Location';
        }
    );
}

// ===== Booking =====
async function handleBooking(e) {
    e.preventDefault();

    if (!currentUser) {
        showToast('Please login first', 'error');
        return;
    }

    if (!currentLocation) {
        showToast('Please share your location', 'error');
        return;
    }

    if (!currentProviderId) {
        showToast('Unable to book this provider', 'error');
        return;
    }

    const date = document.getElementById('bookingDate').value;
    const time = document.getElementById('bookingTime').value;

    try {
        const response = await fetch(`${API_BASE}/bookings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: currentUser.id,
                userName: currentUser.name,
                providerId: currentProviderId,
                date,
                time,
                latitude: currentLocation.latitude,
                longitude: currentLocation.longitude
            })
        });

        const data = await response.json();

        if (response.ok) {
            showToast('Booking confirmed! Check your bookings page.', 'success');
            document.getElementById('bookingForm').reset();
            currentLocation = null;
            document.getElementById('locationStatus').innerHTML = '';
            navigateTo('bookings');
        } else {
            showToast(data.message || 'Booking failed', 'error');
        }
    } catch (error) {
        showToast('Error: ' + error.message, 'error');
    }
}

async function loadBookings() {
    if (!currentUser) {
        navigateTo('login');
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/bookings?userId=${currentUser.id}`);
        const data = await response.json();

        const container = document.getElementById('bookingsContainer');

        if (data.success && data.data.length > 0) {
            container.innerHTML = data.data.map(booking => `
                <div class="booking-card">
                    <h3>${booking.providerName}</h3>
                    <p><strong>Date:</strong> ${new Date(booking.date).toLocaleDateString()}</p>
                    <p><strong>Time:</strong> ${booking.time}</p>
                    <p><strong>Location:</strong> ${booking.address}</p>
                    <p><strong>Price:</strong> ₹${booking.price}/hour</p>
                    <span class="booking-status ${booking.status.toLowerCase()}">${booking.status}</span>
                </div>
            `).join('');
        } else {
            container.innerHTML = '<p class="no-data">No bookings yet</p>';
        }
    } catch (error) {
        document.getElementById('bookingsContainer').innerHTML = '<p class="no-data">Error loading bookings</p>';
        console.error(error);
    }
}

async function loadWorkerDashboard() {
    if (!currentUser || currentUser.role !== 'worker') {
        navigateTo('login');
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/bookings/worker?providerId=${currentUser.providerId}`);
        const data = await response.json();

        const stats = document.getElementById('workerStats');
        const container = document.getElementById('workerBookingsContainer');

        if (data.success && data.data.length > 0) {
            const total = data.data.length;
            const pending = data.data.filter(b => b.status === 'Pending').length;
            const accepted = data.data.filter(b => b.status === 'Accepted').length;
            const completed = data.data.filter(b => b.status === 'Completed').length;

            stats.innerHTML = `
                <div class="stat-card glass-effect">
                    <span class="stat-value">${total}</span>
                    <span class="stat-label">Total Bookings</span>
                </div>
                <div class="stat-card glass-effect">
                    <span class="stat-value">${pending}</span>
                    <span class="stat-label">Pending</span>
                </div>
                <div class="stat-card glass-effect">
                    <span class="stat-value">${accepted}</span>
                    <span class="stat-label">Accepted</span>
                </div>
                <div class="stat-card glass-effect">
                    <span class="stat-value">${completed}</span>
                    <span class="stat-label">Completed</span>
                </div>
            `;

            container.innerHTML = data.data.map(booking => `
                <div class="booking-card">
                    <h3>${booking.userName}</h3>
                    <p><strong>Mobile:</strong> ${booking.userPhone || 'N/A'}</p>
                    <p><strong>Date:</strong> ${new Date(booking.date).toLocaleDateString()}</p>
                    <p><strong>Time:</strong> ${booking.time}</p>
                    <p><strong>Service:</strong> ${booking.providerName}</p>
                    <p><strong>Location:</strong> ${booking.address}</p>
                    <span class="booking-status ${booking.status.toLowerCase()}">${booking.status}</span>
                    <div class="booking-actions">
                        ${booking.status === 'Pending' ? `<button class="btn btn-primary" onclick="updateBookingStatus(${booking.id}, 'Accepted')">Accept</button>` : ''}
                        ${booking.status !== 'Completed' && booking.status !== 'Cancelled' ? `<button class="btn btn-secondary" onclick="updateBookingStatus(${booking.id}, 'Cancelled')">Cancel</button>` : ''}
                        ${booking.status === 'Accepted' ? `<button class="btn btn-primary" onclick="updateBookingStatus(${booking.id}, 'Completed')">Complete</button>` : ''}
                    </div>
                </div>
            `).join('');
        } else {
            stats.innerHTML = '';
            container.innerHTML = '<p class="no-data">No bookings assigned yet.</p>';
        }
    } catch (error) {
        document.getElementById('workerBookingsContainer').innerHTML = '<p class="no-data">Error loading dashboard</p>';
        console.error(error);
    }
}

async function updateBookingStatus(bookingId, status) {
    try {
        const response = await fetch(`${API_BASE}/bookings/${bookingId}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });

        const data = await response.json();
        if (response.ok) {
            showToast(`Booking ${status.toLowerCase()} successfully`, 'success');
            loadWorkerDashboard();
        } else {
            showToast(data.message || 'Unable to update booking status', 'error');
        }
    } catch (error) {
        showToast('Error: ' + error.message, 'error');
    }
}

async function loadAdminDashboard() {
    if (!currentUser || currentUser.role !== 'admin') {
        navigateTo('login');
        return;
    }

    try {
        const [overviewResponse, workersResponse, complaintsResponse] = await Promise.all([
            fetch(`${API_BASE}/admin/overview`),
            fetch(`${API_BASE}/admin/workers`),
            fetch(`${API_BASE}/admin/complaints`)
        ]);

        const overviewData = await overviewResponse.json();
        const workersData = await workersResponse.json();
        const complaintsData = await complaintsResponse.json();

        const stats = document.getElementById('adminStats');
        stats.innerHTML = overviewData.success ? `
            <div class="stat-card glass-effect">
                <span class="stat-value">${overviewData.data.totalWorkers}</span>
                <span class="stat-label">Total Workers</span>
            </div>
            <div class="stat-card glass-effect">
                <span class="stat-value">${overviewData.data.pendingBookings}</span>
                <span class="stat-label">Pending Bookings</span>
            </div>
            <div class="stat-card glass-effect">
                <span class="stat-value">${overviewData.data.acceptedBookings}</span>
                <span class="stat-label">Accepted Bookings</span>
            </div>
            <div class="stat-card glass-effect">
                <span class="stat-value">${overviewData.data.completedBookings}</span>
                <span class="stat-label">Completed Bookings</span>
            </div>
            <div class="stat-card glass-effect">
                <span class="stat-value">${overviewData.data.totalComplaints}</span>
                <span class="stat-label">Complaints</span>
            </div>
        ` : '<p class="no-data">Unable to load overview</p>';

        // Add worker performance section
        if (overviewData.success && overviewData.data.workerStats && overviewData.data.workerStats.length > 0) {
            const workerStatsSection = document.createElement('section');
            workerStatsSection.className = 'admin-panel';
            workerStatsSection.innerHTML = `
                <div class="admin-panel-card glass-effect">
                    <h2>Worker Performance</h2>
                    <div class="worker-performance-grid">
                        ${overviewData.data.workerStats.map(worker => `
                            <div class="performance-card">
                                <h3>${worker.name}</h3>
                                <div class="performance-stats">
                                    <div class="performance-item">
                                        <span class="performance-value">${worker.completed_jobs}</span>
                                        <span class="performance-label">Completed</span>
                                    </div>
                                    <div class="performance-item">
                                        <span class="performance-value">${worker.pending_jobs}</span>
                                        <span class="performance-label">Pending</span>
                                    </div>
                                    <div class="performance-item">
                                        <span class="performance-value">${worker.accepted_jobs}</span>
                                        <span class="performance-label">Accepted</span>
                                    </div>
                                    <div class="performance-item">
                                        <span class="performance-value">${worker.completion_rate}%</span>
                                        <span class="performance-label">Success Rate</span>
                                    </div>
                                </div>
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: ${worker.completion_rate}%"></div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;

            // Insert after the stats section
            const statsSection = document.querySelector('.admin-panel');
            if (statsSection) {
                statsSection.parentNode.insertBefore(workerStatsSection, statsSection);
            }
        }

        const workersContainer = document.getElementById('adminWorkersContainer');
        if (workersData.success && workersData.data.length > 0) {
            workersContainer.innerHTML = workersData.data.map(worker => `
                <div class="admin-item">
                    <div>
                        <h3>${worker.name}</h3>
                        <p><strong>Email:</strong> ${worker.workerEmail || 'N/A'}</p>
                        <p><strong>Phone:</strong> ${worker.phone}</p>
                        <p><strong>Address:</strong> ${worker.address}</p>
                        <p><strong>Skills:</strong> ${worker.skills}</p>
                        <p><strong>Hourly:</strong> ₹${worker.price}</p>
                    </div>
                    <button class="btn btn-secondary" onclick="removeWorker(${worker.id})">Remove</button>
                </div>
            `).join('');
        } else {
            workersContainer.innerHTML = '<p class="no-data">No workers found</p>';
        }

        const complaintsContainer = document.getElementById('adminComplaintsContainer');
        if (complaintsData.success && complaintsData.data.length > 0) {
            complaintsContainer.innerHTML = complaintsData.data.map(item => `
                <div class="admin-item">
                    <h3>${item.userName || 'Unknown'} filed against ${item.providerName || 'Service'}</h3>
                    <p><strong>Type:</strong> ${item.complaint_type || 'Service complaint'}</p>
                    <p>${item.message}</p>
                    <p><strong>Status:</strong> ${item.status}</p>
                </div>
            `).join('');
        } else {
            complaintsContainer.innerHTML = '<p class="no-data">No complaints found</p>';
        }
    } catch (error) {
        document.getElementById('adminWorkersContainer').innerHTML = '<p class="no-data">Error loading admin dashboard</p>';
        console.error(error);
    }
}

async function handleAddWorker(e) {
    e.preventDefault();

    const name = document.getElementById('workerName').value;
    const email = document.getElementById('workerEmail').value;
    const password = document.getElementById('workerPassword').value;
    const phone = document.getElementById('workerPhone').value;
    const address = document.getElementById('workerAddress').value;
    const skills = document.getElementById('workerSkill').value;
    const price = parseFloat(document.getElementById('workerPrice').value);

    try {
        const response = await fetch(`${API_BASE}/admin/workers`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, phone, address, experience: 5, skills, profileImage: 'https://i.pravatar.cc/300?img=50', workerId: `WK${Date.now()}`, price, rating: 4.5 })
        });

        const data = await response.json();
        if (response.ok) {
            showToast('Worker added successfully. Share login: ' + data.data.email + ' / ' + data.data.password, 'success');
            document.getElementById('addWorkerForm').reset();
            loadAdminDashboard();
        } else {
            showToast(data.message || 'Unable to add worker', 'error');
        }
    } catch (error) {
        showToast('Error: ' + error.message, 'error');
    }
}

async function removeWorker(providerId) {
    try {
        const response = await fetch(`${API_BASE}/admin/workers/${providerId}`, {
            method: 'DELETE'
        });
        const data = await response.json();
        if (response.ok) {
            showToast('Worker removed successfully', 'success');
            loadAdminDashboard();
        } else {
            showToast(data.message || 'Unable to remove worker', 'error');
        }
    } catch (error) {
        showToast('Error: ' + error.message, 'error');
    }
}

// ===== Search =====
function handleSearch(e) {
    const searchTerm = e.target.value;
    if (searchTerm.length > 0) {
        loadServices(searchTerm);
    } else {
        loadServices();
    }
}

// ===== Advanced Filters =====
function applyFilters() {
    const priceMin = parseInt(document.getElementById('priceMin').value) || 0;
    const priceMax = parseInt(document.getElementById('priceMax').value) || 1000;
    const ratingMin = parseFloat(document.getElementById('ratingFilter').value) || 0;
    const experienceMin = parseInt(document.getElementById('experienceFilter').value) || 0;
    const verifiedOnly = document.getElementById('verifiedFilter').value === 'verified';

    // Update price display
    document.getElementById('priceMinDisplay').textContent = priceMin;
    document.getElementById('priceMaxDisplay').textContent = priceMax;

    // Get all service cards
    const cards = document.querySelectorAll('#servicesContainer .service-card');

    let visibleCount = 0;
    cards.forEach(card => {
        const priceText = card.querySelector('.service-card-price')?.textContent || '₹0';
        const price = parseInt(priceText.replace(/₹|\/hour/g, '')) || 0;
        
        const ratingText = card.querySelector('.rating-stars')?.textContent || '0';
        const rating = parseFloat(ratingText) || 0;
        
        const experienceText = card.dataset.experience || '0';
        const experience = parseInt(experienceText) || 0;

        const verified = card.dataset.verified !== 'false';

        const priceMatch = price >= priceMin && price <= priceMax;
        const ratingMatch = rating >= ratingMin;
        const experienceMatch = experience >= experienceMin;
        const verifiedMatch = !verifiedOnly || verified;

        if (priceMatch && ratingMatch && experienceMatch && verifiedMatch) {
            card.style.display = '';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });

    // Show no results message if needed
    if (visibleCount === 0) {
        const container = document.getElementById('servicesContainer');
        if (!container.querySelector('.no-results')) {
            const noResults = document.createElement('p');
            noResults.className = 'no-results';
            noResults.style.gridColumn = '1 / -1';
            noResults.style.textAlign = 'center';
            noResults.style.color = 'var(--text-light)';
            noResults.style.padding = '2rem';
            noResults.textContent = 'No services match your filters. Try adjusting your criteria.';
            container.appendChild(noResults);
        }
    } else {
        const noResults = document.querySelector('.no-results');
        if (noResults) noResults.remove();
    }
}

function resetFilters() {
    document.getElementById('priceMin').value = 100;
    document.getElementById('priceMax').value = 1000;
    document.getElementById('ratingFilter').value = '0';
    document.getElementById('experienceFilter').value = '0';
    document.getElementById('verifiedFilter').value = '';
    
    applyFilters();
    loadServices();
}

// ===== Toast Notifications =====
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <strong>${type.charAt(0).toUpperCase() + type.slice(1)}:</strong> ${message}
    `;

    document.getElementById('toastContainer').appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 4000);
}

// ===== Utilities =====
function setMinDate() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('bookingDate').min = today;
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== Policy Management =====
const policyContent = {
    privacy: `
        <h1>Privacy Policy</h1>
        <h2>1. Information We Collect</h2>
        <p>Service Finder collects personal information you provide such as name, email, phone number, location, and payment details to facilitate service bookings.</p>
        
        <h2>2. How We Use Your Information</h2>
        <p>We use your information to:</p>
        <ul>
            <li>Process and manage your service bookings</li>
            <li>Communicate about your bookings and services</li>
            <li>Improve our platform and user experience</li>
            <li>Prevent fraud and ensure platform security</li>
            <li>Send you promotional offers (with your consent)</li>
        </ul>
        
        <h2>3. Data Protection</h2>
        <p>We implement industry-standard security measures to protect your personal data. Your information is encrypted and stored securely on our servers.</p>
        
        <h2>4. Third-Party Sharing</h2>
        <p>We do not sell your personal information. We only share data with service providers necessary to complete your bookings.</p>
        
        <h2>5. Your Rights</h2>
        <p>You have the right to access, modify, or delete your personal data at any time by contacting our support team.</p>
        
        <h2>6. Cookies</h2>
        <p>We use cookies to enhance your browsing experience. You can control cookie settings in your browser preferences.</p>
        
        <h2>7. Policy Changes</h2>
        <p>We reserve the right to update this privacy policy. We will notify users of significant changes via email or website notice.</p>
        
        <h2>Contact Us</h2>
        <p>For privacy concerns, contact us at: privacy@servicefinder.com</p>
    `,
    
    terms: `
        <h1>Terms & Conditions</h1>
        <h2>1. Acceptance of Terms</h2>
        <p>By accessing and using Service Finder, you accept and agree to be bound by the terms and provision of this agreement.</p>
        
        <h2>2. Use License</h2>
        <p>Permission is granted to temporarily download one copy of the materials (information or software) from Service Finder for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:</p>
        <ul>
            <li>Modify or copy the materials</li>
            <li>Use the materials for any commercial purpose or for any public display</li>
            <li>Attempt to decompile or reverse engineer any software</li>
            <li>Remove any copyright or other proprietary notations</li>
        </ul>
        
        <h2>3. Disclaimer of Warranties</h2>
        <p>The materials on Service Finder are provided on an 'as is' basis. Service Finder makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
        
        <h2>4. Limitations of Liability</h2>
        <p>In no event shall Service Finder or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Service Finder.</p>
        
        <h2>5. Accuracy of Materials</h2>
        <p>The materials appearing on Service Finder could include technical, typographical, or photographic errors. Service Finder does not warrant that any of the materials on our website are accurate, complete, or current.</p>
        
        <h2>6. User Conduct</h2>
        <p>You agree not to post any abusive, obscene, defamatory, or sexually oriented material. Any user who posts such content will have their account terminated.</p>
        
        <h2>7. Booking Terms</h2>
        <p>All bookings are subject to service provider availability and confirmation. Cancellations must be made within the specified timeframe as per Cancellation Policy.</p>
        
        <h2>Contact for Terms</h2>
        <p>Questions about these terms should be directed to: legal@servicefinder.com</p>
    `,
    
    support: `
        <h1>Support Policy</h1>
        <h2>1. Customer Support Hours</h2>
        <p>Service Finder provides customer support 24/7 through:</p>
        <ul>
            <li>Email: support@servicefinder.com</li>
            <li>Phone: +91 1800-SERVICE (1800-737-8423)</li>
            <li>In-app chat support</li>
        </ul>
        
        <h2>2. Response Time</h2>
        <p>We aim to respond to your queries within:</p>
        <ul>
            <li>Emergency issues: 15 minutes</li>
            <li>Urgent issues: 1 hour</li>
            <li>Regular queries: 4 hours</li>
            <li>Non-urgent queries: 24 hours</li>
        </ul>
        
        <h2>3. Support Categories</h2>
        <p><strong>Technical Support:</strong> Issues with app functionality and website</p>
        <p><strong>Booking Support:</strong> Help with bookings, scheduling, and modifications</p>
        <p><strong>Payment Support:</strong> Payment issues and refund inquiries</p>
        <p><strong>Service Issues:</strong> Complaints or issues with service quality</p>
        
        <h2>4. Ticket System</h2>
        <p>All support requests are logged with a ticket number for tracking. You can reference your ticket number in all communications.</p>
        
        <h2>5. Escalation Process</h2>
        <p>If your issue is not resolved within 48 hours, it will be escalated to our senior support team.</p>
        
        <h2>6. Feedback</h2>
        <p>We welcome your feedback to improve our support services. Please rate your support experience after resolution.</p>
    `,
    
    cancellation: `
        <h1>Cancellation Policy</h1>
        <h2>1. Booking Cancellation</h2>
        <p>You may cancel your booking anytime through the app. Refund eligibility depends on the cancellation timing:</p>
        
        <h2>2. Cancellation Timeline & Refunds</h2>
        <ul>
            <li><strong>More than 48 hours before service:</strong> Full refund (100%)</li>
            <li><strong>24-48 hours before service:</strong> 75% refund</li>
            <li><strong>12-24 hours before service:</strong> 50% refund</li>
            <li><strong>Less than 12 hours:</strong> 25% refund</li>
            <li><strong>No-show or cancelled by provider:</strong> 100% refund</li>
        </ul>
        
        <h2>3. Service Provider Cancellation</h2>
        <p>If a service provider cancels, you will receive:</p>
        <ul>
            <li>Full refund of booking amount</li>
            <li>Discount voucher for 20% off next booking</li>
            <li>Option to reschedule with priority booking</li>
        </ul>
        
        <h2>4. How to Cancel</h2>
        <p>To cancel a booking:</p>
        <ul>
            <li>Go to "My Bookings" in the app</li>
            <li>Select the booking you wish to cancel</li>
            <li>Click "Cancel Booking"</li>
            <li>Confirm cancellation</li>
            <li>Refund will be processed within 5-7 business days</li>
        </ul>
        
        <h2>5. Exceptions</h2>
        <p>Refunds will NOT be provided for:</p>
        <ul>
            <li>Cancellations due to customer unavailability at the agreed time/location</li>
            <li>Force majeure events (natural disasters, lockdowns, etc.) - 50% refund will be provided</li>
            <li>Cancellations made after service has commenced</li>
        </ul>
        
        <h2>6. Contact for Cancellation Issues</h2>
        <p>For cancellation-related queries, contact: cancellations@servicefinder.com</p>
    `,
    
    cookie: `
        <h1>Cookie Policy</h1>
        <h2>1. What Are Cookies?</h2>
        <p>Cookies are small data files stored on your device. They help us remember your preferences and improve your experience on Service Finder.</p>
        
        <h2>2. Types of Cookies We Use</h2>
        <p><strong>Essential Cookies:</strong> Required for basic website functionality and security.</p>
        <p><strong>Performance Cookies:</strong> Help us understand how you use the site to improve performance.</p>
        <p><strong>Functional Cookies:</strong> Remember your preferences and settings.</p>
        <p><strong>Marketing Cookies:</strong> Track your activity to show relevant ads (with consent).</p>
        
        <h2>3. Cookie Duration</h2>
        <ul>
            <li>Session cookies: Deleted when you close your browser</li>
            <li>Persistent cookies: Remain for the specified duration</li>
            <li>Authentication cookies: Remain until you logout</li>
        </ul>
        
        <h2>4. Cookie Management</h2>
        <p>You can control cookies through your browser settings:</p>
        <ul>
            <li>Chrome: Settings → Privacy → Cookies and site data</li>
            <li>Firefox: Options → Privacy → Cookies</li>
            <li>Safari: Preferences → Privacy → Cookies and site data</li>
            <li>Edge: Settings → Privacy → Cookies and site data</li>
        </ul>
        
        <h2>5. Third-Party Cookies</h2>
        <p>We may allow third parties (analytics providers, payment processors) to set cookies for their services. These are governed by their respective privacy policies.</p>
        
        <h2>6. Updates to This Policy</h2>
        <p>We may update our cookie policy periodically. Continued use of the site constitutes acceptance of any changes.</p>
    `
};

function openPolicy(policyType, event) {
    if (event) event.preventDefault();
    
    const modal = document.getElementById('policyModal');
    const content = document.getElementById('policyContent');
    
    if (policyContent[policyType]) {
        content.innerHTML = policyContent[policyType];
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closePolicy() {
    const modal = document.getElementById('policyModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Close modal when clicking outside the modal content
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('policyModal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closePolicy();
            }
        });
    }
});
