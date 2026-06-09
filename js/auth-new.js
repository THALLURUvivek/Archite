// ===========================
// STACKLY LOGIN FUNCTIONALITY
// With Built-in Crypto API (No CDN required)
// ===========================

const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        // Check if CryptoUtils is available
        if (typeof CryptoUtils === 'undefined') {
            alert("Error: Crypto utilities failed to load. Please refresh the page.");
            return;
        }

        // Get and sanitize inputs
        const emailInput = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        // ===========================
        // 1. VALIDATE INPUTS
        // ===========================

        // Sanitize and validate email
        const email = CryptoUtils.sanitizeEmail(emailInput);
        if (!email) {
            alert("Please enter a valid email address.");
            return;
        }

        if (!password) {
            alert("Please enter your password.");
            return;
        }

        // ===========================
        // 2. RETRIEVE USER FROM LOCALSTORAGE
        // ===========================

        const storedUser = localStorage.getItem(email);

        if (!storedUser) {
            alert("User not found! Please check your email or create an account.");
            return;
        }

        let user;
        try {
            user = JSON.parse(storedUser);
        } catch (error) {
            console.error("Error parsing user data:", error);
            alert("An error occurred. Please try again.");
            return;
        }

        // ===========================
        // 3. VERIFY PASSWORD
        // ===========================

        try {
            // Show loading state
            const submitButton = loginForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            submitButton.textContent = "Logging in...";
            submitButton.disabled = true;

            // Hash the entered password and compare with stored hash
            const passwordMatches = await CryptoUtils.verifyPassword(password, user.password);

            if (passwordMatches) {
                // ===========================
                // 4. SET SESSION DATA
                // ===========================

                localStorage.setItem("loggedIn", "true");
                localStorage.setItem("userEmail", user.email);
                localStorage.setItem("userName", user.name);
                localStorage.setItem("lastActivity", Date.now());

                // Set CSRF token for session
                CryptoUtils.setCSRFToken();

                alert("Login successful! Welcome back, " + user.name + "!");

                // Redirect to dashboard
                window.location.href = "dashboard.html";

            } else {
                // Reset button state
                submitButton.textContent = originalButtonText;
                submitButton.disabled = false;

                alert("Invalid password! Please try again.");
            }

        } catch (error) {
            console.error("Login error:", error);
            alert("An error occurred during login. Please try again.");

            // Reset button state
            const submitButton = loginForm.querySelector('button[type="submit"]');
            if (submitButton) {
                submitButton.textContent = "Login";
                submitButton.disabled = false;
            }
        }
    });
}

// ===========================
// ADMIN LOGIN FUNCTIONALITY
// ===========================

async function adminLogin() {
    // Check if CryptoUtils is available
    if (typeof CryptoUtils === 'undefined') {
        alert("Error: Crypto utilities failed to load. Please refresh the page.");
        return;
    }

    const emailInput = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    // Sanitize and validate email
    const email = CryptoUtils.sanitizeEmail(emailInput);
    if (!email) {
        alert("Please enter a valid email address.");
        return;
    }

    if (!password) {
        alert("Please enter your password.");
        return;
    }

    // Retrieve admin from localStorage
    const storedAdmin = localStorage.getItem(email);

    if (!storedAdmin) {
        alert("Admin account not found!");
        return;
    }

    let admin;
    try {
        admin = JSON.parse(storedAdmin);
    } catch (error) {
        console.error("Error parsing admin data:", error);
        alert("An error occurred. Please try again.");
        return;
    }

    // Verify password
    try {
        const passwordMatches = await CryptoUtils.verifyPassword(password, admin.password);

        if (passwordMatches) {
            // Set admin session data
            localStorage.setItem("adminLoggedIn", "true");
            localStorage.setItem("adminEmail", admin.email);
            localStorage.setItem("adminName", admin.name);
            localStorage.setItem("lastActivity", Date.now());

            // Set CSRF token for session
            CryptoUtils.setCSRFToken();

            alert("Admin login successful! Welcome, " + admin.name + "!");

            // Redirect to admin dashboard
            window.location.href = "admin-dashboard.html";

        } else {
            alert("Invalid admin password!");
        }

    } catch (error) {
        console.error("Admin login error:", error);
        alert("An error occurred during admin login. Please try again.");
    }
}
