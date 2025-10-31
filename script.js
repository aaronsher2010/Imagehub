// Load images from localStorage or use default placeholders
let images = JSON.parse(localStorage.getItem("images")) || [
  { src: "https://via.placeholder.com/400x250", title: "Sample 1", category: "Game" },
  { src: "https://via.placeholder.com/400x250", title: "Sample 2", category: "Nature" },
  { src: "https://via.placeholder.com/400x250", title: "Sample 3", category: "Sci-Fi" }
];

// Display gallery
function displayGallery() {
  const grid = document.getElementById("galleryGrid");
  if (!grid) return;
  grid.innerHTML = "";

  images.forEach(imgData => {
    const card = document.createElement("div");
    card.className = "image-card";
    card.innerHTML = `
      <img src="${imgData.src}" alt="${imgData.title}" onclick="openModal('${imgData.src}','${imgData.title}')">
      <div class="overlay">
        <h3>${imgData.title}</h3>
        <p>Category: ${imgData.category}</p>
      </div>
    `;
    grid.appendChild(card);
  });
}

// Generate category buttons
function generateCategoryButtons() {
  const container = document.getElementById("categoryButtons");
  if (!container) return;

  const categories = ["All", ...new Set(images.map(img => img.category))];
  container.innerHTML = "";

  categories.forEach(cat => {
    const btn = document.createElement("button");
    btn.textContent = cat;
    btn.onclick = () => filterByCategory(cat, btn);
    container.appendChild(btn);
  });
}

// Filter gallery by category
function filterByCategory(category, btn) {
  const grid = document.getElementById("galleryGrid");
  const cards = grid.getElementsByClassName("image-card");

  // Highlight active button
  const allButtons = document.querySelectorAll(".category-buttons button");
  allButtons.forEach(b => b.classList.remove("active"));
  btn.classList.add("active");

  Array.from(cards).forEach(card => {
    const cardCategory = card.querySelector("p").innerText.replace("Category: ", "");
    card.style.display = category === "All" || cardCategory === category ? "" : "none";
  });
}

// Search/filter gallery
function filterGallery() {
  const query = document.getElementById("search")?.value.toLowerCase();
  if (!query) return;
  const grid = document.getElementById("galleryGrid");
  if (!grid) return;

  const cards = grid.getElementsByClassName("image-card");
  Array.from(cards).forEach(card => {
    const title = card.querySelector("h3").innerText.toLowerCase();
    const category = card.querySelector("p").innerText.toLowerCase();
    card.style.display = title.includes(query) || category.includes(query) ? "" : "none";
  });
}

// Modal
function openModal(src, title) {
  const modal = document.getElementById("imageModal");
  if (!modal) return;

  document.getElementById("imageModal").style.display = "block";
  document.getElementById("modalImage").src = src;
  document.getElementById("modalTitle").innerText = title;

  const downloadBtn = document.getElementById("downloadBtn");
  downloadBtn.onclick = () => {
    const a = document.createElement("a");
    a.href = src;
    a.download = title + ".jpg";
    a.click();
  };
}

function closeModal() {
  const modal = document.getElementById("imageModal");
  if (!modal) return;
  modal.style.display = "none";
}

// Upload image
function uploadImage() {
  const input = document.getElementById("imageInput");
  const title = document.getElementById("imageTitle")?.value.trim();
  const category = document.getElementById("imageCategory")?.value.trim();
  const status = document.getElementById("uploadStatus");

  if (!input?.files[0]) {
    if (status) status.textContent = "Please select a JPEG file.";
    return;
  }
  if (!title || !category) {
    if (status) status.textContent = "Please enter both a title and category.";
    return;
  }
  const file = input.files[0];
  if (file.type !== "image/jpeg") {
    if (status) status.textContent = "Only JPEG images are allowed.";
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    const newImage = {
      src: e.target.result,
      title: title,
      category: category
    };
    images.push(newImage);

    // Save to localStorage
    localStorage.setItem("images", JSON.stringify(images));

    // Update gallery immediately if exists
    if (document.getElementById("galleryGrid")) {
      displayGallery();
      generateCategoryButtons();
    }

    if (status) status.textContent = "Upload successful!";
    if (input) input.value = "";
    const titleInput = document.getElementById("imageTitle");
    if (titleInput) titleInput.value = "";
    const categoryInput = document.getElementById("imageCategory");
    if (categoryInput) categoryInput.value = "";
  }
  reader.readAsDataURL(file);
}

// Initialize gallery on page load (only if gallery exists)
window.onload = () => {
  const storedImages = JSON.parse(localStorage.getItem("images"));
  if (storedImages) images = storedImages;

  if (document.getElementById("galleryGrid")) {
    displayGallery();
    generateCategoryButtons();
  }
};
