const links = document.querySelectorAll("header a,.hire-btn");
const sections = document.querySelectorAll("main section");

function showSection(id) {
    sections.forEach(section => {
        // Home shows everything, other links show only their own section
        const visible = (id === "home") || (section.id === id);
        section.classList.toggle("active", visible);
    });

    links.forEach(link => {
        link.classList.toggle("selected", link.getAttribute("href") === "#" + id);
    });
}

links.forEach(link => {
    link.addEventListener("click", event => {
        event.preventDefault();
        showSection(link.getAttribute("href").slice(1));
    });
});
/* ---------- Gallery ---------- */
const photoInput = document.getElementById("photoInput");
const galleryGrid = document.getElementById("galleryGrid");
const emptyMsg = document.getElementById("emptyMsg");

let photos = [];
try {
    photos = JSON.parse(localStorage.getItem("galleryPhotos")) || [];
} catch (e) {
    photos = [];
}

function savePhotos() {
    try {
        localStorage.setItem("galleryPhotos", JSON.stringify(photos));
    } catch (e) {
        alert("Storage is full. Delete a photo and try again.");
    }
}

function renderGallery() {
    galleryGrid.innerHTML = "";

    photos.forEach((src, index) => {
        const card = document.createElement("figure");
        card.className = "photo-card";

        const img = document.createElement("img");
        img.src = src;
        img.alt = "Gallery photo " + (index + 1);

        const del = document.createElement("button");
        del.type = "button";
        del.className = "delete-photo";
        del.textContent = "✕";
        del.setAttribute("aria-label", "Delete photo");
        del.addEventListener("click", () => {
            if (confirm("Delete this photo?")) {
                photos.splice(index, 1);
                savePhotos();
                renderGallery();
            }
        });

        card.append(img, del);
        galleryGrid.appendChild(card);
    });

    emptyMsg.style.display = photos.length ? "none" : "block";
}

function shrinkPhoto(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = () => reject(new Error("Could not read the file"));
        reader.onload = () => {
            const img = new Image();
            img.onerror = () => reject(new Error("Could not open the image"));
            img.onload = () => {
                const scale = Math.min(1, 800 / Math.max(img.width, img.height));
                const canvas = document.createElement("canvas");
                canvas.width = img.width * scale;
                canvas.height = img.height * scale;
                canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
                resolve(canvas.toDataURL("image/jpeg", 0.8));
            };
            img.src = reader.result;
        };
        reader.readAsDataURL(file);
    });
}

photoInput.addEventListener("change", async () => {
    try {
        const files = Array.from(photoInput.files);
        for (const file of files) {
            photos.push(await shrinkPhoto(file));
        }
        savePhotos();
        renderGallery();
    } catch (error) {
        alert("Something went wrong: " + error.message);
    }
    photoInput.value = "";
});

showSection("home");
renderGallery();

showSection("home");   // the page opens showing everything