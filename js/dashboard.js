// ===========================
// AUTH CHECK
// ===========================

const isLoggedIn =
    localStorage.getItem("loggedIn");

if (!isLoggedIn) {

    alert(
        "Please login first!"
    );

    window.location.href =
        "login.html";
}

// ===========================
// USER DATA
// ===========================

const userEmail =
    localStorage.getItem("userEmail");

const profileInfo =
    document.querySelector(".profile-info");

if (userEmail && profileInfo) {

    profileInfo.innerHTML = `
        <p>
            <strong>Name:</strong>
            STACKLY User
        </p>

        <p>
            <strong>Email:</strong>
            ${userEmail}
        </p>

        <p>
            <strong>Membership:</strong>
            Premium
        </p>
    `;
}

// ===========================
// LOGOUT
// ===========================

const logoutBtn =
    document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        (e) => {

            e.preventDefault();

            const confirmLogout =
                confirm(
                    "Are you sure you want to logout?"
                );

            if (confirmLogout) {

                localStorage.removeItem(
                    "loggedIn"
                );

                localStorage.removeItem(
                    "userEmail"
                );

                alert(
                    "Logged out successfully!"
                );

                window.location.href =
                    "login.html";
            }

        }
    );
}



// ===========================
// CARD ANIMATION
// ===========================

const cards =
    document.querySelectorAll(
        ".stat-card, .project-card"
    );

cards.forEach(card => {

    card.addEventListener(
        "mouseenter",
        () => {

            card.style.transform =
                "translateY(-10px)";
        }
    );

    card.addEventListener(
        "mouseleave",
        () => {

            card.style.transform =
                "translateY(0)";
        }
    );

});

// ===========================
// WELCOME MESSAGE
// ===========================

const welcomeTitle =
    document.querySelector(
        ".welcome-card h1"
    );

if (welcomeTitle) {

    welcomeTitle.innerHTML =
        `Welcome Back 👋`;
}

// ===========================
// PAGE LOAD ANIMATION
// ===========================

window.addEventListener(
    "load",
    () => {

        document.body.style.opacity = "0";

        setTimeout(() => {

            document.body.style.transition =
                "opacity .8s ease";

            document.body.style.opacity = "1";

        }, 100);

    }


);


