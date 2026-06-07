const state = {
  works: [],
  typeFilter: "all",
  brandFilter: "",
  search: ""
};

const grid = document.querySelector("#masonryGrid");
const brandStrip = document.querySelector("#brandStrip");
const resultCount = document.querySelector("#resultCount");
const clearBrand = document.querySelector("#clearBrand");
const emptyState = document.querySelector("#emptyState");
const searchInput = document.querySelector("#searchInput");
const modal = document.querySelector("#previewModal");
const modalBody = document.querySelector("#modalBody");
const modalClose = document.querySelector("#modalClose");

const typeLabels = {
  graphic: "Graphic",
  video: "Video",
  reel: "Reel"
};

function normalize(value) {
  return String(value || "").trim().toLowerCase();
}

function slugify(value) {
  return normalize(value).replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function getYoutubeId(url = "") {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtu.be")) return parsed.pathname.slice(1);
    if (parsed.searchParams.get("v")) return parsed.searchParams.get("v");
    const match = parsed.pathname.match(/\/embed\/([^/?]+)/);
    return match ? match[1] : "";
  } catch {
    return "";
  }
}

function getThumbnail(item) {
  if (item.thumbnailUrl) return item.thumbnailUrl;
  if (item.thumbnail) return item.thumbnail;
  if (item.mediaFile && item.mediaType !== "video") return item.mediaFile;
  if (item.mediaUrl && item.mediaType !== "video") return item.mediaUrl;
  const youtubeId = item.source === "youtube" ? getYoutubeId(item.externalUrl) : "";
  if (youtubeId) return `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
  return "";
}

function isVideoType(item) {
  return ["video", "reel"].includes(normalize(item.type));
}

function getBrands() {
  return [...new Set(state.works.map(item => item.brand).filter(Boolean))].sort((a, b) => a.localeCompare(b));
}

function filteredWorks() {
  const query = normalize(state.search);
  return state.works.filter(item => {
    const itemType = normalize(item.type);
    const brand = normalize(item.brand);
    const haystack = normalize([item.title, item.brand, item.type, item.source, ...(item.tags || [])].join(" "));
    const matchesType = state.typeFilter === "all" ||
      (state.typeFilter === "video" && isVideoType(item)) ||
      (state.typeFilter === "graphic" && itemType === "graphic");
    const matchesBrand = !state.brandFilter || brand === normalize(state.brandFilter);
    const matchesSearch = !query || haystack.includes(query);
    return matchesType && matchesBrand && matchesSearch;
  });
}

function renderBrands() {
  const brands = getBrands();
  brandStrip.innerHTML = brands.map(brand => `
    <button class="brand-chip ${state.brandFilter === brand ? "active" : ""}" type="button" data-brand="${brand}">${brand}</button>
  `).join("");

  brandStrip.querySelectorAll(".brand-chip").forEach(button => {
    button.addEventListener("click", () => {
      state.brandFilter = button.dataset.brand;
      state.typeFilter = "all";
      document.querySelectorAll(".filter-btn").forEach(btn => btn.classList.toggle("active", btn.dataset.filter === "all"));
      brandStrip.classList.remove("hidden");
      render();
    });
  });
}

function renderCard(item, index) {
  const thumb = getThumbnail(item);
  const label = typeLabels[normalize(item.type)] || item.type || "Work";
  const media = thumb
    ? `<img class="card-media" src="${thumb}" alt="${item.title || item.brand || "Dairr Studios work"}" loading="lazy" />`
    : `<div class="card-placeholder"><div><strong>${item.source === "instagram" ? "Instagram Post" : "Dairr Studios"}</strong><span>${item.brand || "Selected Work"}</span></div></div>`;

  return `
    <article class="card" role="button" tabindex="0" data-index="${index}">
      ${media}
      <div class="card-content">
        <div class="card-topline">
          <span class="badge">${label}</span>
          <span class="badge">${item.source || "Manual"}</span>
        </div>
        <h2>${item.title || "Untitled Work"}</h2>
        <p class="brand-name">${item.brand || "Dairr Studios"}</p>
      </div>
    </article>
  `;
}

function render() {
  const works = filteredWorks();
  grid.innerHTML = works.map((item, index) => renderCard(item, index)).join("");
  resultCount.textContent = `${works.length} ${works.length === 1 ? "piece" : "pieces"} of work${state.brandFilter ? ` for ${state.brandFilter}` : ""}`;
  clearBrand.classList.toggle("hidden", !state.brandFilter);
  emptyState.classList.toggle("hidden", works.length > 0);
  grid.classList.toggle("hidden", works.length === 0);

  grid.querySelectorAll(".card").forEach(card => {
    card.addEventListener("click", () => openModal(works[Number(card.dataset.index)]));
    card.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") openModal(works[Number(card.dataset.index)]);
    });
  });

  renderBrands();
}

function buildModalMedia(item) {
  const youtubeId = item.source === "youtube" ? getYoutubeId(item.externalUrl) : "";
  if (youtubeId) {
    return `<iframe src="https://www.youtube.com/embed/${youtubeId}" title="${item.title || "YouTube video"}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;
  }

  const media = item.mediaFile || item.mediaUrl || item.thumbnailUrl || item.thumbnail;
  if (media && (item.mediaType === "video" || isVideoType(item))) {
    return `<video src="${media}" controls playsinline></video>`;
  }

  if (media) {
    return `<img src="${media}" alt="${item.title || item.brand || "Dairr Studios work"}" />`;
  }

  return `<div class="card-placeholder"><div><strong>${item.source === "instagram" ? "Instagram Post" : "Dairr Studios"}</strong><span>${item.externalUrl ? "Open the original link below" : "Add a thumbnail from admin"}</span></div></div>`;
}

function openModal(item) {
  modalBody.innerHTML = `
    <div class="modal-visual">${buildModalMedia(item)}</div>
    <aside class="modal-info">
      <span class="badge">${typeLabels[normalize(item.type)] || item.type || "Work"}</span>
      <h2>${item.title || "Untitled Work"}</h2>
      <p><strong>Brand:</strong> ${item.brand || "Dairr Studios"}</p>
      ${item.description ? `<p>${item.description}</p>` : ""}
      ${item.tags && item.tags.length ? `<p><strong>Tags:</strong> ${item.tags.join(", ")}</p>` : ""}
      ${item.externalUrl ? `<a class="external-link" href="${item.externalUrl}" target="_blank" rel="noopener noreferrer">View Original</a>` : ""}
    </aside>
  `;
  modal.showModal();
}

async function loadWorks() {
  try {
    const response = await fetch("/data/works.json", { cache: "no-store" });
    const data = await response.json();
    state.works = Array.isArray(data.works) ? data.works : [];
    render();
  } catch (error) {
    console.error(error);
    resultCount.textContent = "Could not load work data.";
    emptyState.classList.remove("hidden");
  }
}

document.querySelectorAll(".filter-btn").forEach(button => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    state.typeFilter = filter === "brands" ? "all" : filter;
    if (filter === "brands") {
      brandStrip.classList.toggle("hidden");
    } else {
      brandStrip.classList.add("hidden");
    }
    document.querySelectorAll(".filter-btn").forEach(btn => btn.classList.toggle("active", btn === button));
    render();
  });
});

searchInput.addEventListener("input", event => {
  state.search = event.target.value;
  render();
});

clearBrand.addEventListener("click", () => {
  state.brandFilter = "";
  render();
});

modalClose.addEventListener("click", () => modal.close());
modal.addEventListener("click", event => {
  if (event.target === modal) modal.close();
});

loadWorks();
