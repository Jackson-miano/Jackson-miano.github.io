   const links = document.querySelectorAll("header a");
    const sections = document.querySelectorAll("main section");

    function showSection(id) {
        sections.forEach(section => {
            section.classList.toggle("active", section.id === id);
        });
        links.forEach(link => {
            link.classList.toggle("selected", link.getAttribute("href") === "#" + id);
        });
    }

    links.forEach(link => {
        link.addEventListener("click", event => {
            event.preventDefault();   // stops the page from jumping
            showSection(link.getAttribute("href").slice(1));
        });
    });

    showSection("home");   // the page opens on Home