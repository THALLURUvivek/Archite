// ===========================
// FILTER BUTTON ACTIVE STATE
// ===========================

const filterButtons =
    document.querySelectorAll(".filter-btn");

filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        filterButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

    });

});

// ===========================
// SAVE PROJECTS
// ===========================

const saveButtons =
    document.querySelectorAll(".save-btn");

saveButtons.forEach(button => {

    button.addEventListener("click", () => {

        const card =
            button.closest(".project-card");

        const projectName =
            card.querySelector("h3").innerText;

        let savedProjects =
            JSON.parse(
                localStorage.getItem(
                    "savedProjects"
                )
            ) || [];

        if (
            !savedProjects.includes(
                projectName
            )
        ) {

            savedProjects.push(
                projectName
            );

            localStorage.setItem(
                "savedProjects",
                JSON.stringify(
                    savedProjects
                )
            );

            button.innerHTML =
                '<i class="fa-solid fa-heart"></i>';

            button.style.color = "red";

            alert(
                `${projectName} saved successfully!`
            );

        } else {

            alert(
                `${projectName} already saved!`
            );

        }

    });

});

// ===========================
// RESTORE SAVED PROJECTS
// ===========================

const savedProjects =
    JSON.parse(
        localStorage.getItem(
            "savedProjects"
        )
    ) || [];

document
    .querySelectorAll(".project-card")
    .forEach(card => {

        const projectName =
            card.querySelector("h3").innerText;

        const saveBtn =
            card.querySelector(".save-btn");

        if (
            savedProjects.includes(
                projectName
            )
        ) {

            saveBtn.innerHTML =
                '<i class="fa-solid fa-heart"></i>';

            saveBtn.style.color =
                "red";
        }

    });

// Mobile menu loaded separately via mobile-menu.js