// STORAGE KEY
const STORAGE_KEY = "lnf_lost_found_items";

// Global items array
let items = [];

// DOM elements
const itemsContainer = document.getElementById("itemsContainer");
const reportForm = document.getElementById("reportForm");
const formFeedback = document.getElementById("formFeedback");
const itemsCountSpan = document.getElementById("itemsCount");

// Helper: save to localStorage
function persistItems() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

// Load items from localStorage (no sample data)
function loadItems() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        try {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed)) {
                items = parsed;
                // ensure each item has required fields and valid status (lost/found)
                items = items.filter(item => item && typeof item === 'object').map(item => ({
                    id: item.id,
                    name: item.name || "Unnamed",
                    description: item.description || "",
                    location: item.location || "",
                    date: item.date || "",
                    contact: item.contact || "",
                    status: (item.status === 'found') ? 'found' : 'lost',
                    createdAt: item.createdAt || item.id || Date.now()
                }));
            } else {
                items = [];
            }
        } catch (e) {
            items = [];
        }
    } else {
        // first time visitor: empty array, no sample data
        items = [];
    }
    // sort by newest first (most recent creation)
    items.sort((a, b) => (b.createdAt || b.id) - (a.createdAt || a.id));
}

// Update item count display
function updateItemsCount() {
    const total = items.length;
    itemsCountSpan.textContent = `${total} ${total === 1 ? 'item' : 'items'}`;
}

// XSS protection
function escapeHtml(str) {
    if (!str) return "";
    return str.replace(/[&<>]/g, function (m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

// Show temporary feedback message
function showFeedback(msg, isError = false) {
    formFeedback.textContent = msg;
    formFeedback.style.color = isError ? '#c2412c' : '#2f6b47';
    setTimeout(() => {
        if (formFeedback.textContent === msg) {
            formFeedback.textContent = '';
        }
    }, 2800);
}

// Render all items into grid (cards)
function renderItems() {
    if (!itemsContainer) return;

    if (items.length === 0) {
        itemsContainer.innerHTML = `<div class="empty-state">✨ No lost items reported yet.<br>Use the form to report something missing.</div>`;
        updateItemsCount();
        return;
    }

    let cardsHTML = '';
    for (let item of items) {
        // format date for display
        let displayDate = item.date;
        if (item.date && item.date.match(/\d{4}-\d{2}-\d{2}/)) {
            try {
                const parsedDate = new Date(item.date);
                if (!isNaN(parsedDate.getTime())) {
                    displayDate = parsedDate.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
                }
            } catch (e) { }
        }

        const isLost = item.status === 'lost';
        const statusClass = isLost ? 'lost' : 'found';
        const statusLabel = isLost ? 'LOST' : 'FOUND';

        // Mark as Found button only appears if status is 'lost'
        const markButtonHtml = isLost
            ? `<button class="mark-found-btn" data-id="${item.id}" data-action="markFound">✓ mark as found</button>`
            : '';

        cardsHTML += `
            <div class="item-card" data-item-id="${item.id}">
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
                    <button class="delete-btn" data-id="${item.id}" data-action="delete" title="remove item">🗑️</button>
                </div>
            </div>
        `;
    }

    itemsContainer.innerHTML = cardsHTML;
    updateItemsCount();
}

// Add new item (always status = 'lost')
function addNewItem(event) {
    event.preventDefault();

    const nameInput = document.getElementById("itemName");
    const locationInput = document.getElementById("location");
    const dateInput = document.getElementById("date");
    const contactInput = document.getElementById("contact");
    const descriptionInput = document.getElementById("description");

    const name = nameInput.value.trim();
    const location = locationInput.value.trim();
    const date = dateInput.value;
    const contact = contactInput.value.trim();
    const description = descriptionInput.value.trim();

    // validation
    if (!name) {
        showFeedback("Please enter item name.", true);
        return;
    }
    if (!location) {
        showFeedback("Location is required (where it was lost).", true);
        return;
    }
    if (!date) {
        showFeedback("Please select the date when it was lost.", true);
        return;
    }
    if (!contact) {
        showFeedback("Contact info is required (email or phone).", true);
        return;
    }
    if (!description) {
        showFeedback("Please add a brief description.", true);
        return;
    }

    // new item object, always status = 'lost'
    const newItem = {
        id: Date.now() + Math.floor(Math.random() * 10000),
        name: name,
        description: description,
        location: location,
        date: date,
        contact: contact,
        status: "lost",
        createdAt: Date.now()
    };

    items.unshift(newItem);   // newest at the top
    persistItems();
    renderItems();

    // reset form
    reportForm.reset();
    // set today's date again for convenience
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;

    showFeedback("✓ Item reported as LOST. It appears in the list above.", false);

    // optional scroll to the new card
    setTimeout(() => {
        const firstCard = document.querySelector('.item-card');
        if (firstCard) firstCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
}

// Mark item as Found (change status from 'lost' to 'found')
function markItemAsFound(itemId) {
    const targetItem = items.find(item => item.id == itemId);
    if (!targetItem) return;
    if (targetItem.status === 'found') {
        showFeedback("Item is already marked as found.", false);
        return;
    }
    // update status
    targetItem.status = 'found';
    persistItems();
    renderItems();
    showFeedback(`✔️ "${targetItem.name}" marked as FOUND.`, false);
}

// Delete item
function deleteItem(itemId) {
    const itemToDelete = items.find(item => item.id == itemId);
    if (!itemToDelete) return;
    const confirmDelete = confirm(`Remove "${itemToDelete.name}" permanently?`);
    if (!confirmDelete) return;

    const newItems = items.filter(item => item.id != itemId);
    items = newItems;
    persistItems();
    renderItems();
    showFeedback(`"${itemToDelete.name}" removed from list.`, false);
}

// Event delegation for dynamic card actions
function handleContainerClicks(e) {
    const target = e.target;
    // Mark as Found button
    const markBtn = target.closest('.mark-found-btn');
    if (markBtn && markBtn.dataset.action === 'markFound') {
        const id = markBtn.getAttribute('data-id');
        if (id) markItemAsFound(parseInt(id));
        e.preventDefault();
        return;
    }

    // Delete button
    const delBtn = target.closest('.delete-btn');
    if (delBtn && delBtn.dataset.action === 'delete') {
        const id = delBtn.getAttribute('data-id');
        if (id) deleteItem(parseInt(id));
        e.preventDefault();
        return;
    }
}

// Set today's date as default in the date picker
function setDefaultDate() {
    const dateField = document.getElementById("date");
    if (dateField && !dateField.value) {
        const today = new Date().toISOString().split('T')[0];
        dateField.value = today;
    }
}

// Initialization
function init() {
    loadItems();          // loads from localStorage (empty for new users)
    renderItems();
    setDefaultDate();
    reportForm.addEventListener("submit", addNewItem);
    itemsContainer.addEventListener("click", handleContainerClicks);

    // Ensure that if items array is empty, localStorage reflects that (no leftover seed)
    if (items.length === 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    }
}

init();