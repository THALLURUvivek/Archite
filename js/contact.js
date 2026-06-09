const contactForm =
    document.getElementById("contactForm");

if(contactForm){

    contactForm.addEventListener(
        "submit",
        (e)=>{

            e.preventDefault();

            alert(
                "Thank you for your interest!\n\nThis is a demo portfolio. For actual inquiries, please contact us directly at:\n\nEmail: info@stackly.com\nPhone: +91 9876543210"
            );

            contactForm.reset();

        }
    );

}


        const menuBtn =
document.querySelector(".menu-btn");

const navLinks =
document.querySelector(".nav-links");

menuBtn.addEventListener(
    "click",
    () => {

        navLinks.classList.toggle(
            "active"
        );

    }
);

