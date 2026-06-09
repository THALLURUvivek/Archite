// ===========================
// STACKLY LOGIN FUNCTIONALITY
// With Enhanced Security (bcrypt verification, input sanitization)
// ===========================

const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        // Check if required libraries are loaded
        if (typeof bcrypt === 'undefined') {
            alert("Error: Security library (bcrypt) failed to load. Please refresh the page and try again.");
            return;
        }

        if (typeof SecurityUtils === 'undefined') {
            alert("Error: Security utilities failed to load. Please refresh the page and try again.");
            return;
        }

        // Get and sanitize inputs
        const emailInput = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        // ===========================
        // 1. VALIDATE INPUTS
        // ===========================

        // Sanitize and validate email
        const email = SecurityUtils.sanitizeEmail(emailInput);
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
        // 3. VERIFY PASSWORD WITH BCRYPT
        // ===========================

        try {
            // Show loading state
            const submitButton = loginForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            submitButton.textContent = "Logging in...";
            submitButton.disabled = true;

            // Check if password is hashed (new users) or plaintext (old users - migration support)
            let passwordMatches = false;

            if (user.password.startsWith('$2a$') || user.password.startsWith('$2b$') || user.password.startsWith('$2y$')) {
                // Password is hashed - use bcrypt comparison
                passwordMatches = bcrypt.compareSync(password, user.password);
            } else {
                // Legacy plaintext password (for backwards compatibility during migration)
                // In production, you should force users to reset passwords
                passwordMatches = (user.password === password);

                // Optionally: Auto-upgrade to hashed password
                if (passwordMatches) {
                    const hashedPassword = bcrypt.hashSync(password, 10);
                    user.password = hashedPassword;
                    localStorage.setItem(email, JSON.stringify(user));
                }
            }

            if (passwordMatches) {
                // ===========================
                // 4. SET SESSION DATA
                // ===========================

                localStorage.setItem("loggedIn", "true");
                localStorage.setItem("userEmail", user.email);
                localStorage.setItem("userName", user.name);
                localStorage.setItem("lastActivity", Date.now());

                // Set CSRF token for session
                SecurityUtils.setCSRFToken();

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

function adminLogin() {
    // Check if required libraries are loaded
    if (typeof bcrypt === 'undefined') {
        alert("Error: Security library (bcrypt) failed to load. Please refresh the page and try again.");
        return;
    }

    if (typeof SecurityUtils === 'undefined') {
        alert("Error: Security utilities failed to load. Please refresh the page and try again.");
        return;
    }

    const emailInput = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    // Sanitize and validate email
    const email = SecurityUtils.sanitizeEmail(emailInput);
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

    // Verify password with bcrypt
    try {
        let passwordMatches = false;

        if (admin.password.startsWith('$2a$') || admin.password.startsWith('$2b$') || admin.password.startsWith('$2y$')) {
            // Password is hashed - use bcrypt comparison
            passwordMatches = bcrypt.compareSync(password, admin.password);
        } else {
            // Legacy plaintext password (for backwards compatibility)
            passwordMatches = (admin.password === password);

            // Auto-upgrade to hashed password
            if (passwordMatches) {
                const hashedPassword = bcrypt.hashSync(password, 10);
                admin.password = hashedPassword;
                localStorage.setItem(email, JSON.stringify(admin));
            }
        }

        if (passwordMatches) {
            // Set admin session data
            localStorage.setItem("adminLoggedIn", "true");
            localStorage.setItem("adminEmail", admin.email);
            localStorage.setItem("adminName", admin.name);
            localStorage.setItem("lastActivity", Date.now());

            // Set CSRF token for session
            SecurityUtils.setCSRFToken();

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