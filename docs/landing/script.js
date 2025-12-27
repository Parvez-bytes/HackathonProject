import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";
import { getFirestore, getDoc, doc } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCW56P6O0OooDcC8282V0ZOUMvnYeNp6L4",
    authDomain: "authrization-page.firebaseapp.com",
    projectId: "authrization-page",
    storageBucket: "authrization-page.firebasestorage.app",
    messagingSenderId: "796390339142",
    appId: "1:796390339142:web:476cc494eaed08154c5047"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

onAuthStateChanged(auth, (user) => {
    const isGuest = sessionStorage.getItem("guest") === "true";
const isUser = localStorage.getItem("loggedInUserId");

if (!isGuest && !isUser) {
  window.location.href = "../authrization/index.html";
}


    const uid = localStorage.getItem("loggedInUserId");
    if (!uid) return;

    getDoc(doc(db, "users", uid)).then((docSnap) => {
        if (docSnap.exists()) {
            const data = docSnap.data();
            document.getElementById("loggedUserFname").innerText = data.firstName;
            document.getElementById("loggedUserLname").innerText = data.lastName;
            document.getElementById("loggedUserEmail").innerText = data.email;
        }
    });
});

document.getElementById("logoutButton").addEventListener("click", async () => {
    await signOut(auth);
    localStorage.removeItem("loggedInUserId");
    window.location.href = "../authrization/index.html";
});




document.addEventListener('DOMContentLoaded', function () {
    const notifications = [
        {
            id: 1,
            title: 'Exam Form Update',
            message: 'Last date for submission extended to 25th Dec',
            time: '2 hours ago'
        },
        {
            id: 2,
            title: 'Scholarship Alert',
            message: 'New scholarship applications are now open',
            time: '1 day ago'
        },
        {
            id: 3,
            title: 'Attendance Shortage',
            message: 'Attendance regularization window is now open',
            time: '2 days ago'
        },
    ];

    const doubtCategories = [
        {
            type: 'attendance',
            title: 'Attendance Related Doubt',
            description: 'Get instant solutions for attendance shortage issues, leave applications, and percentage calculations.',
            icon: 'calendar-check',
            color: '#3b82f6', 
            features: ['Shortage Issues', 'Leave Applications', '% Calculation']
        },
        {
            type: 'exam',
            title: 'Exam Cell/Form',
            description: 'Resolve exam form rejections, schedule queries, hall ticket issues, and exam-related concerns.',
            icon: 'file-alt',
            color: '#10b981', 
            features: ['Form Rejection', 'Schedule Queries', 'Hall Tickets']
        },
        {
            type: 'scholarship',
            title: 'Scholarship Form Doubt',
            description: 'Get help with scholarship eligibility, application process, documentation, and status tracking.',
            icon: 'graduation-cap',
            color: '#f59e0b', 
            features: ['Eligibility', 'Documentation', 'Status Check']
        },
        {
            type: 'ticket',
            title: 'Ticket Raised Solution',
            description: 'Track your raised tickets, escalate existing issues, and view previous solutions.',
            icon: 'ticket-alt',
            color: '#ef4444', 
            features: ['Track Status', 'Escalate', 'History']
        }
    ];

    
    const notificationButton = document.getElementById('notificationButton');
    const notificationDropdown = document.getElementById('notificationDropdown');
    const notificationList = document.getElementById('notificationList');
    const clearNotificationsBtn = document.getElementById('clearNotifications');
    const authButton = document.getElementById('authButton');
    const authModal = document.getElementById('authModal');
    const closeModalBtn = document.getElementById('closeModal');
    const doubtBoxesContainer = document.getElementById('doubtBoxesContainer');

    function loadNotifications() {
        notificationList.innerHTML = '';
        notifications.forEach(notification => {
            const notificationItem = document.createElement('div');
            notificationItem.className = 'notification-item';
            notificationItem.innerHTML = `
                        <div class="notification-icon">
                            <div class="notification-dot"></div>
                        </div>
                        <div class="notification-content">
                            <h4>${notification.title}</h4>
                            <p>${notification.message}</p>
                            <span class="notification-time">${notification.time}</span>
                        </div>
                    `;
            notificationList.appendChild(notificationItem);
        });
    }

    function loadDoubtBoxes() {
        doubtBoxesContainer.innerHTML = '';
        doubtCategories.forEach((category, index) => {
            const doubtBox = document.createElement('div');
            doubtBox.className = 'doubt-box';
            doubtBox.style.setProperty('--box-color', category.color);
            doubtBox.innerHTML = `
                        <div class="box-header">
                            <div class="box-icon-container" style="background: ${category.color}20">
                                <div class="box-icon" style="color: ${category.color}">
                                    <i class="fas fa-${category.icon}"></i>
                                </div>
                                <div class="icon-glow" style="background: ${category.color}"></div>
                            </div>
                            <div class="box-badge" style="background: ${category.color}">
                                ${category.type}
                            </div>
                        </div>

                        <div class="box-content">
                            <h3 class="box-title">${category.title}</h3>
                            <p class="box-description">${category.description}</p>
                            
                            <div class="box-features">
                                ${category.features.map(feature =>
                `<span class="feature-tag" style="background: ${category.color}30">${feature}</span>`
            ).join('')}
                            </div>
                        </div>

                        <div class="box-footer">
                            <button class="box-action" style="--box-color: ${category.color}">
                                <span>Get Help</span>
                                <i class="fas fa-arrow-right arrow-icon"></i>
                            </button>
                            <div class="box-stats">
                                <div class="stat">
                                    <span class="stat-value">98%</span>
                                    <span class="stat-label">Resolved</span>
                                </div>
                                <div class="stat">
                                    <span class="stat-value">24h</span>
                                    <span class="stat-label">Response</span>
                                </div>
                            </div>
                        </div>

                        <div class="box-hover-effect" style="background: ${category.color}10"></div>
                    `;

            doubtBox.addEventListener('click', function () {
                if (category.type === "ticket") {
                    window.location.href = "ticketpage.html";
                } else {
                    window.location.href = `chat.html?topic=${category.type}`;

                }
            });


            doubtBoxesContainer.appendChild(doubtBox);
        });
    }

    notificationButton.addEventListener('click', function (e) {
        e.stopPropagation();
        notificationDropdown.classList.toggle('show');
    });

    clearNotificationsBtn.addEventListener('click', function () {
        if (confirm('Are you sure you want to clear all notifications?')) {
            notificationList.innerHTML = '<div class="notification-item"><p>No notifications</p></div>';
            document.querySelector('.notification-badge').textContent = '0';
        }
    });

    authButton.addEventListener('click', function () {
        authModal.classList.add('show');
    });

    closeModalBtn.addEventListener('click', function () {
        authModal.classList.remove('show');
    });

    authModal.addEventListener('click', function (e) {
        if (e.target === authModal) {
            authModal.classList.remove('show');
        }
    });

    document.addEventListener('click', function (e) {
        if (!notificationDropdown.contains(e.target) && !notificationButton.contains(e.target)) {
            notificationDropdown.classList.remove('show');
        }
    });

    const logoIcon = document.querySelector('.logo-icon');
    let rotation = 0;
    setInterval(() => {
        rotation += 0.5;
        logoIcon.style.transform = `rotate(${rotation}deg)`;
    }, 50);

    loadNotifications();
    loadDoubtBoxes();

    const boxes = document.querySelectorAll('.doubt-box');
    boxes.forEach(box => {
        box.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-10px)';
        });

        box.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0)';
        });
    });

    const floatingElements = document.querySelectorAll('.stat, .doubt-box');
    floatingElements.forEach((el, index) => {
        el.style.animationDelay = `${index * 0.1}s`;
    });
});


let lastScrollTop = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', function () {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > lastScrollTop) {
        header.classList.add('hidden');
        header.classList.remove('visible');
    } else {
        header.classList.remove('hidden');
        header.classList.add('visible');
    }

    if (scrollTop === 0) {
        header.classList.remove('hidden');
        header.classList.add('visible');
    }

    lastScrollTop = scrollTop;
});

document.querySelectorAll(".auth-option").forEach(btn => {
    btn.addEventListener("click", () => {
        window.location.href = "../authrization/index.html";
    });
});

