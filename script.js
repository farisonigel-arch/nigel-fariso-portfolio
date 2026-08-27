const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const navAnchors = [...document.querySelectorAll(".nav-links a")];

menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    document.body.classList.toggle("menu-open", isOpen);
});

navAnchors.forEach((link) => {
    link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        document.body.classList.remove("menu-open");
    });
});

const sections = [...document.querySelectorAll("main section[id]")];
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navAnchors.forEach((link) => {
            link.classList.toggle(
                "active",
                link.getAttribute("href") === `#${entry.target.id}`
            );
        });
    });
}, { rootMargin: "-35% 0px -55% 0px", threshold: 0 });

sections.forEach((section) => observer.observe(section));

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

const filterButtons = [...document.querySelectorAll(".filter-btn")];
const projectCards = [...document.querySelectorAll(".project-card")];

filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const filter = button.dataset.filter;

        filterButtons.forEach((item) => item.classList.remove("active"));
        button.classList.add("active");

        projectCards.forEach((card) => {
            const matches = filter === "all" || card.dataset.category === filter;
            card.classList.toggle("hidden", !matches);
        });
    });
});

const form = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");

form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
        formMessage.textContent = "Please complete all fields with valid information.";
        formMessage.style.color = "#ffb4b4";
        form.reportValidity();
        return;
    }

    const name = new FormData(form).get("name").trim();
    formMessage.textContent = `Thank you, ${name}. Your message has been validated successfully. Connect this form to a backend or email service to send real messages.`;
    formMessage.style.color = "#8CFF98";
    form.reset();
});

document.getElementById("year").textContent = new Date().getFullYear();
