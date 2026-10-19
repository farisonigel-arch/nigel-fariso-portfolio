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

const filterButtons = [...document.querySelectorAll('#projects .filter-btn[data-filter]')];
const projectCards = [...document.querySelectorAll('#projects .project-card')];

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

/* Certifications: filter buttons + row-based "View more" / "View less" pagination */
const certGrid = document.getElementById("certGrid");

if (certGrid) {
    const certFilterButtons = [...document.querySelectorAll('#certifications .filter-btn[data-filter]')];
    const certCards = [...certGrid.querySelectorAll(".project-card")];
    const viewMoreBtn = document.getElementById("viewMoreBtn");
    const viewLessBtn = document.getElementById("viewLessBtn");

    const DEFAULT_ROWS = 2;
    let visibleRows = DEFAULT_ROWS;
    let activeFilter = "all";

    // Determine how many cards sit in a single row at the current viewport width.
    const getColumnsPerRow = () => {
        const columns = getComputedStyle(certGrid).gridTemplateColumns.split(" ").length;
        return Math.max(1, columns);
    };

    const getFilteredCards = () =>
        certCards.filter((card) => activeFilter === "all" || card.dataset.category === activeFilter);

    const renderCerts = () => {
        const filtered = getFilteredCards();
        const perRow = getColumnsPerRow();
        const visibleCount = visibleRows * perRow;

        certCards.forEach((card) => card.classList.add("cert-hidden-page"));
        filtered.forEach((card, index) => {
            if (index < visibleCount) card.classList.remove("cert-hidden-page");
        });

        const hasMore = filtered.length > visibleCount;
        const hasAtLeastThreeRows = visibleRows >= 3;

        viewMoreBtn.classList.toggle("is-visible", hasMore);
        viewLessBtn.classList.toggle("is-visible", hasAtLeastThreeRows);
    };

    certFilterButtons.forEach((button) => {
        button.addEventListener("click", () => {
            certFilterButtons.forEach((item) => item.classList.remove("active"));
            button.classList.add("active");
            activeFilter = button.dataset.filter;
            visibleRows = DEFAULT_ROWS;
            renderCerts();
        });
    });

    viewMoreBtn.addEventListener("click", () => {
        visibleRows += 1;
        renderCerts();
    });

    viewLessBtn.addEventListener("click", () => {
        if (visibleRows > DEFAULT_ROWS) visibleRows -= 1;
        renderCerts();
    });

    let resizeTimer;
    window.addEventListener("resize", () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(renderCerts, 150);
    });

    renderCerts();
}

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
