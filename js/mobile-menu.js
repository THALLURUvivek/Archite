// ===========================
// MOBILE MENU TOGGLE
// Updated for new navbar structure
// ===========================

const menuBtn = document.querySelector(".menu-btn");
const navMenu = document.querySelector(".nav-menu");
const navLinksAll = document.querySelectorAll(".nav-links a");

// Toggle menu on button click
if (menuBtn && navMenu) {
    menuBtn.addEventListener("click", () => {
        navMenu.classList.toggle("active");

        // Change icon when menu is open
        const icon = menuBtn.querySelector("i");
        if (navMenu.classList.contains("active")) {
            icon.classList.remove("fa-bars");
            icon.classList.add("fa-times");
        } else {
            icon.classList.remove("fa-times");
            icon.classList.add("fa-bars");
        }
    });

    // Close menu when clicking on a link
    navLinksAll.forEach(link => {
        link.addEventListener("click", () => {
            navMenu.classList.remove("active");
            const icon = menuBtn.querySelector("i");
            icon.classList.remove("fa-times");
            icon.classList.add("fa-bars");
        });
    });

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
        if (!navMenu.contains(e.target) && !menuBtn.contains(e.target)) {
            navMenu.classList.remove("active");
            const icon = menuBtn.querySelector("i");
            icon.classList.remove("fa-times");
            icon.classList.add("fa-bars");
        }
    });
}


function adminLogin() {

    const username =
        document.getElementById("username").value.trim();

    const password =
        document.getElementById("password").value;

    // Allow only letters
    const usernameRegex = /^[A-Za-z]+$/;

    if (!usernameRegex.test(username)) {
        alert(
            "Username should contain only letters!"
        );
        return;
    }

    const storedAdmin =
        localStorage.getItem(username);

    if (!storedAdmin) {

        alert(
            "Admin not found!"
        );

        return;
    }

    const admin =
        JSON.parse(storedAdmin);

    if (
        admin.password === password
    ) {

        localStorage.setItem(
            "adminLoggedIn",
            "true"
        );

        localStorage.setItem(
            "adminEmail",
            admin.email
        );

        localStorage.setItem(
            "adminName",
            admin.name
        );

        alert(
            "Admin Login Successful!"
        );

        window.location.href =
            "admin-dashboard.html";

    } else {

        alert(
            "Invalid Password!"
        );

    }
}