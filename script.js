// STORAGE KEY
const STORAGE_KEY = "lnf_lost_found_img";

let items = [];           // array of item objects
let currentImageData = null;   // base64 string for new report preview

// DOM elements
const itemsContainer = document.getElementById("itemsContainer");
const reportForm = document.getElementById("reportForm");
const formFeedback = document.getElementById("formFeedback");
const itemsCountSpan = document.getElementById("itemsCount");
const imageInput = document.getElementById("imageInput");
const uploadTrigger = document.getElementById("uploadTrigger");
const imagePreviewContainer = document.getElementById("imagePreviewContainer");

// Helper: save to localStorage
function persistItems() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

// Load from localStorage (no sample data)
function loadItems() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        try {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed)) {
                items = parsed;
                // sanitize & ensure fields
                items = items.filter(item => item && typeof item === 'object').map(item => ({
                    id: item.id,
                    name: item.name || "Unnamed",
                    description: item.description || "",
                    location: item.location || "",
                    date: item.date || "",
                    contact: item.contact || "",
                    status: (item.status === 'found') ? 'found' : 'lost',
                    imageBase64: item.imageBase64 || null,
                    createdAt: item.createdAt || item.id || Date.now()
                }));
            } else items = [];
        } catch (e) { items = []; }
    } else {
        items = [];   // completely empty for new users
    }
    // sort newest first
    items.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
}

// update item count badge
function updateCount() {
    itemsCountSpan.textContent = `${items.length} ${items.length === 1 ? 'item' : 'items'}`;
}

// escape HTML
function escapeHtml(str) {
    if (!str) return "";
    return str.replace(/[&<>]/g, function (m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

// show temporary feedback
function showFeedback(msg, isError = false) {
    formFeedback.textContent = msg;
    formFeedback.style.color = isError ? '#c2412c' : '#2f6b47';
    setTimeout(() => {
        if (formFeedback.textContent === msg) formFeedback.textContent = '';
    }, 2800);
}

// render all items as cards
function renderItems() {
    if (!itemsContainer) return;
    if (items.length === 0) {
        itemsContainer.innerHTML = `<div class="empty-state">✨ No lost items reported yet.<br>Use the form above to report something missing.</div>`;
        updateCount();
        return;
    }

    let html = '';
    for (let item of items) {
        const isLost = item.status === 'lost';
        const statusClass = isLost ? 'lost' : 'found';
        const statusLabel = isLost ? 'LOST' : 'FOUND';
        const displayDate = formatDate(item.date);
        const imageHtml = item.imageBase64
            ? `<img class="card-image" src="${escapeHtml(item.imageBase64)}" alt="item photo" loading="lazy">`
            : `<div class="card-image" style="background: #eef2f7; display:flex; align-items:center; justify-content:center; font-size: 2rem;">📷</div>`;

        const markButtonHtml = isLost
            ? `<button class="mark-found-btn" data-id="${item.id}" data-action="markFound">✓ mark as found</button>`
            : `<button class="mark-found-btn" disabled style="opacity:0.6;">✓ found</button>`;

        html += `
            <div class="item-card" data-item-id="${item.id}">
                ${imageHtml}
                <div class="card-row">
                    <div class="item-name">${escapeHtml(item.name)}</div>
                    <div class="status-badge ${statusClass}">${statusLabel}</div>
                </div>
                <div class="item-description">${escapeHtml(item.description)}</div>
                <div class="detail-line">
                    <span class="detail-label">📍 Location</span>
                    <span class="detail-value">${escapeHtml(item.location)}</span>
                </div>
                <div class="detail-line">
                    <span class="detail-label">📅 Date</span>
                    <span class="detail-value">${escapeHtml(displayDate)}</span>
                </div>
                <div class="contact-line">
                    📞 ${escapeHtml(item.contact)}
                </div>
                <div class="card-actions">
                    ${markButtonHtml}
                    <button class="delete-btn" data-id="${item.id}" data-action="delete" title="remove">🗑️</button>
                </div>
            </div>
        `;
    }
    itemsContainer.innerHTML = html;
    updateCount();
}

function formatDate(dateStr) {
    if (!dateStr) return "Unknown date";
    if (dateStr.match(/\d{4}-\d{2}-\d{2}/)) {
        try {
            const d = new Date(dateStr);
            if (!isNaN(d.getTime())) return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
        } catch (e) { }
    }
    return dateStr;
}

// Image preview handling
function setupImageUpload() {
    uploadTrigger.addEventListener('click', () => imageInput.click());
    imageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (!file.type.match('image/jpeg') && !file.type.match('image/png') && !file.type.match('image/jpg')) {
            showFeedback("Please select a valid image (jpg, png, jpeg).", true);
            imageInput.value = '';
            return;
        }
        const reader = new FileReader();
        reader.onload = function (ev) {
            currentImageData = ev.target.result;
            displayImagePreview(currentImageData);
        };
        reader.readAsDataURL(file);
    });
}

function displayImagePreview(dataUrl) {
    imagePreviewContainer.innerHTML = `<div style="position:relative; display:inline-block;"><img src="${dataUrl}" class="preview-img" alt="preview"><button type="button" class="remove-img" id="removePreviewBtn">✖ remove</button></div>`;
    const removeBtn = document.getElementById('removePreviewBtn');
    if (removeBtn) {
        removeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            currentImageData = null;
            imagePreviewContainer.innerHTML = '';
            imageInput.value = '';
        });
    }
}

function resetImagePreview() {
    currentImageData = null;
    imagePreviewContainer.innerHTML = '';
    imageInput.value = '';
}

// Add new item (always status 'lost')
function addNewItem(event) {
    event.preventDefault();
    const name = document.getElementById("itemName").value.trim();
    const location = document.getElementById("location").value.trim();
    const date = document.getElementById("date").value;
    const contact = document.getElementById("contact").value.trim();
    const description = document.getElementById("description").value.trim();

    if (!name) { showFeedback("Item name is required", true); return; }
    if (!location) { showFeedback("Location is required", true); return; }
    if (!date) { showFeedback("Date is required", true); return; }
    if (!contact) { showFeedback("Contact info is required", true); return; }
    if (!description) { showFeedback("Description is required", true); return; }

    const newItem = {
        id: Date.now() + Math.floor(Math.random() * 100000),
        name: name,
        description: description,
        location: location,
        date: date,
        contact: contact,
        status: "lost",
        imageBase64: currentImageData || null,
        createdAt: Date.now()
    };

    items.unshift(newItem);
    persistItems();
    renderItems();

    // reset form and image preview
    reportForm.reset();
    const today = new Date().toISOString().split('T')[0];
    document.getElementById("date").value = today;
    resetImagePreview();
    showFeedback("✓ Lost item reported with image (if uploaded).", false);
    setTimeout(() => {
        document.querySelector('.items-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
}

// Mark as Found
function markItemAsFound(itemId) {
    const target = items.find(i => i.id == itemId);
    if (!target) return;
    if (target.status === 'found') {
        showFeedback("Already marked as found", false);
        return;
    }
    target.status = 'found';
    persistItems();
    renderItems();
    showFeedback(`✔️ "${target.name}" marked as FOUND`, false);
}

// Delete item
function deleteItem(itemId) {
    const item = items.find(i => i.id == itemId);
    if (!item) return;
    if (confirm(`Remove "${item.name}" permanently?`)) {
        items = items.filter(i => i.id != itemId);
        persistItems();
        renderItems();
        showFeedback(`"${item.name}" deleted`, false);
    }
}

// Event delegation for card actions
function handleContainerClicks(e) {
    const target = e.target;
    const markBtn = target.closest('.mark-found-btn');
    if (markBtn && markBtn.dataset.action === 'markFound') {
        const id = markBtn.getAttribute('data-id');
        if (id) markItemAsFound(parseInt(id));
        e.preventDefault();
        return;
    }
    const delBtn = target.closest('.delete-btn');
    if (delBtn && delBtn.dataset.action === 'delete') {
        const id = delBtn.getAttribute('data-id');
        if (id) deleteItem(parseInt(id));
        e.preventDefault();
        return;
    }
}

// Set default date in form
function setDefaultDate() {
    const dateField = document.getElementById("date");
    if (dateField && !dateField.value) {
        const today = new Date().toISOString().split('T')[0];
        dateField.value = today;
    }
}

// Initialize app with empty storage (no sample data)
function init() {
    loadItems();     // loads from localStorage, empty for first-timers
    renderItems();
    setDefaultDate();
    setupImageUpload();
    reportForm.addEventListener("submit", addNewItem);
    itemsContainer.addEventListener("click", handleContainerClicks);
    // make sure if items are empty, localstorage is empty (no seeding)
    if (items.length === 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    }
}

init();
