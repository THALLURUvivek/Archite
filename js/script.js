// HERO SLIDER

const slides = document.querySelectorAll(".slide");

let currentSlide = 0;

function showSlide(index) {

    slides.forEach(slide => {
        slide.classList.remove("active");
    });

    slides[index].classList.add("active");
}

function nextSlide() {

    currentSlide++;

    if (currentSlide >= slides.length) {
        currentSlide = 0;
    }

    showSlide(currentSlide);
}

if (slides.length > 0) {

    showSlide(0);

    setInterval(nextSlide, 5000);
}

// MOBILE MENU - Loaded separately via mobile-menu.js

// STICKY NAVBAR

window.addEventListener(
    "scroll",
    () => {

        const navbar =
        document.querySelector(
            ".navbar"
        );

        if(!navbar) return;

        if(window.scrollY > 50){

            navbar.style.background =
            "rgba(2,18,77,.98)";

            navbar.style.padding =
            "15px 8%";

            navbar.style.boxShadow =
            "0 5px 20px rgba(0,0,0,.15)";
        }
        else{

            navbar.style.background =
            "rgba(2,18,77,.85)";

            navbar.style.padding =
            "20px 8%";

            navbar.style.boxShadow =
            "none";
        }

    }
);

// REVEAL ANIMATION

const revealElements =
document.querySelectorAll(
`
.about,
.service-card,
.project-card,
.testimonial-card,
.why-card,
.process-box,
.team-card
`
);

function reveal(){

    revealElements.forEach(
        element => {

            const windowHeight =
            window.innerHeight;

            const revealTop =
            element.getBoundingClientRect().top;

            if(
                revealTop <
                windowHeight - 100
            ){

                element.classList.add(
                    "show"
                );
            }

        }
    );

}

window.addEventListener(
    "scroll",
    reveal
);

reveal();

// COUNTER

const counters =
document.querySelectorAll(
".stat-card h2"
);

let counterStarted =
false;

function startCounter(){

    counters.forEach(counter => {

        const target =
        parseInt(
            counter.innerText
        );

        let count = 0;

        const increment =
        target / 80;

        function updateCounter(){

            if(count < target){

                count += increment;

                counter.innerText =
                Math.ceil(count) + "+";

                setTimeout(
                    updateCounter,
                    20
                );
            }
            else{

                counter.innerText =
                target + "+";
            }

        }

        updateCounter();

    });

}

window.addEventListener(
    "scroll",
    () => {

        const stats =
        document.querySelector(
            ".floating-stats"
        );

        if(!stats) return;

        const sectionTop =
        stats.offsetTop;

        if(
            window.pageYOffset >
            sectionTop -
            window.innerHeight &&
            !counterStarted
        ){

            startCounter();

            counterStarted = true;
        }

    }
);

// FOOTER REVEAL

function revealOnScroll(){

    const reveals =
    document.querySelectorAll(
        ".reveal"
    );

    reveals.forEach(item => {

        const elementTop =
        item.getBoundingClientRect().top;

        if(
            elementTop <
            window.innerHeight - 100
        ){

            item.classList.add(
                "active"
            );
        }

    });

}

window.addEventListener(
    "scroll",
    revealOnScroll
);

revealOnScroll();

