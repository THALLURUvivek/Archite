// ===========================
// STACKLY SIGNUP FUNCTIONALITY
// With Enhanced Security (bcrypt hashing, input sanitization, password strength validation)
// ===========================

const signupForm = document.getElementById("signupForm");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmPassword");
const nameError = document.getElementById("nameError");

// Real-time name validation
if (nameInput && nameError) {
    nameInput.addEventListener("input", () => {
        // Check if SecurityUtils is available
        if (typeof SecurityUtils === 'undefined') {
            return;
        }

        const validation = SecurityUtils.validateName(nameInput.value);

        if (!validation.valid && nameInput.value.length > 0) {
            nameError.textContent = validation.message;
            nameError.style.color = "#ef4444";
        } else {
            nameError.textContent = "";
        }
    });
}

// ===========================
// REAL-TIME PASSWORD STRENGTH INDICATOR
// ===========================

if (passwordInput) {
    const strengthContainer = document.getElementById("passwordStrength");
    const strengthBar = document.getElementById("strengthBar");
    const strengthText = document.getElementById("strengthText");
    const reqLength = document.getElementById("req-length");
    const reqUppercase = document.getElementById("req-uppercase");
    const reqLowercase = document.getElementById("req-lowercase");
    const reqNumber = document.getElementById("req-number");
    const reqSpecial = document.getElementById("req-special");

    passwordInput.addEventListener("input", () => {
        const password = passwordInput.value;

        // Show strength indicator when user starts typing
        if (password.length > 0) {
            strengthContainer.style.display = "block";
        } else {
            strengthContainer.style.display = "none";
            return;
        }

        // Check each requirement
        const hasLength = password.length >= 8;
        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

        // Update requirement checkmarks
        if (reqLength) {
            reqLength.textContent = hasLength ? "✓ At least 8 characters" : "✗ At least 8 characters";
            reqLength.className = hasLength ? "requirement met" : "requirement";
        }

        if (reqUppercase) {
            reqUppercase.textContent = hasUppercase ? "✓ One uppercase letter" : "✗ One uppercase letter";
            reqUppercase.className = hasUppercase ? "requirement met" : "requirement";
        }

        if (reqLowercase) {
            reqLowercase.textContent = hasLowercase ? "✓ One lowercase letter" : "✗ One lowercase letter";
            reqLowercase.className = hasLowercase ? "requirement met" : "requirement";
        }

        if (reqNumber) {
            reqNumber.textContent = hasNumber ? "✓ One number" : "✗ One number";
            reqNumber.className = hasNumber ? "requirement met" : "requirement";
        }

        if (reqSpecial) {
            reqSpecial.textContent = hasSpecial ? "✓ One special character (!@#$%^&*)" : "✗ One special character (!@#$%^&*)";
            reqSpecial.className = hasSpecial ? "requirement met" : "requirement";
        }

        // Calculate strength
        const metRequirements = [hasLength, hasUppercase, hasLowercase, hasNumber, hasSpecial].filter(Boolean).length;

        let strength = "weak";
        let strengthLabel = "Weak";

        if (metRequirements === 5 && password.length >= 12) {
            strength = "strong";
            strengthLabel = "Strong";
        } else if (metRequirements === 5 && password.length >= 10) {
            strength = "good";
            strengthLabel = "Good";
        } else if (metRequirements >= 4) {
            strength = "medium";
            strengthLabel = "Medium";
        } else if (metRequirements >= 3) {
            strength = "medium";
            strengthLabel = "Fair";
        } else {
            strength = "weak";
            strengthLabel = "Weak";
        }

        // Update strength bar
        if (strengthBar) {
            strengthBar.className = "strength-bar-fill " + strength;
        }

        // Update strength text
        if (strengthText) {
            strengthText.textContent = "Password Strength: " + strengthLabel;
            strengthText.className = "strength-text " + strength;
        }
    });

    // Hide strength indicator when password field loses focus and is empty
    passwordInput.addEventListener("blur", () => {
        if (passwordInput.value.length === 0) {
            strengthContainer.style.display = "none";
        }
    });
}

// Main signup form submission handler
if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        // Check if required libraries are loaded
        if (typeof bcrypt === 'undefined') {
            alert("Error: Security library (bcrypt) failed to load. Please refresh the page and try again.");
            return;
        }

        if (typeof DOMPurify === 'undefined') {
            alert("Error: Security library (DOMPurify) failed to load. Please refresh the page and try again.");
            return;
        }

        if (typeof SecurityUtils === 'undefined') {
            alert("Error: Security utilities failed to load. Please refresh the page and try again.");
            return;
        }

        // Get input values
        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        // ===========================
        // 1. VALIDATE INPUTS
        // ===========================

        // Empty field validation
        if (name === "" || email === "" || password === "" || confirmPassword === "") {
            alert("Please fill in all fields.");
            return;
        }

        // Validate name format
        const nameValidation = SecurityUtils.validateName(name);
        if (!nameValidation.valid) {
            nameError.textContent = nameValidation.message;
            nameError.style.color = "#ef4444";
            return;
        }
        nameError.textContent = "";

        // Sanitize and validate email
        const sanitizedEmail = SecurityUtils.sanitizeEmail(email);
        if (!sanitizedEmail) {
            alert("Please enter a valid email address.");
            return;
        }

        // Password strength validation
        const passwordValidation = SecurityUtils.validatePasswordStrength(password);
        if (!passwordValidation.valid) {
            alert("Password Strength Error:\n\n" + passwordValidation.message + "\n\nRequirements:\n- Minimum 8 characters\n- At least one uppercase letter (A-Z)\n- At least one lowercase letter (a-z)\n- At least one number (0-9)\n- At least one special character (!@#$%^&*)");
            return;
        }

        // Confirm password match
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        // ===========================
        // 2. CHECK EXISTING USER
        // ===========================

        const existingUser = localStorage.getItem(sanitizedEmail);
        if (existingUser) {
            alert("An account already exists with this email address.");
            return;
        }

        // ===========================
        // 3. HASH PASSWORD (CRITICAL SECURITY)
        // ===========================

        try {
            // Show loading state (optional - could add a spinner here)
            const submitButton = signupForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            submitButton.textContent = "Creating Account...";
            submitButton.disabled = true;

            // Hash password with bcrypt (work factor 10)
            const hashedPassword = bcrypt.hashSync(password, 10);

            // ===========================
            // 4. CREATE USER OBJECT WITH HASHED PASSWORD
            // ===========================

            const user = {
                name: nameValidation.sanitized, // Use sanitized name
                email: sanitizedEmail,           // Use sanitized email
                password: hashedPassword,        // Store HASHED password (not plaintext)
                createdAt: new Date().toISOString()
            };

            // ===========================
            // 5. STORE USER IN LOCALSTORAGE
            // ===========================

            localStorage.setItem(sanitizedEmail, JSON.stringify(user));

            // Success message
            alert("Account created successfully!\n\nYou can now login with your credentials.");

            // Redirect to login page
            window.location.href = "login.html";

        } catch (error) {
            console.error("Signup error:", error);
            alert("An error occurred during signup. Please try again.");

            // Reset button state
            const submitButton = signupForm.querySelector('button[type="submit"]');
            if (submitButton) {
                submitButton.textContent = "Create Account";
                submitButton.disabled = false;
            }
        }
    });
}