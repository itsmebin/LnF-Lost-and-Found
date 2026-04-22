# LnF – Lost and Found Web

A modern, minimalist web application that helps users report lost items and mark them as found. All data is stored locally in the browser using `localStorage`, so no backend or database is required.

![Lost and Found UI preview](https://via.placeholder.com/800x400?text=Minimalist+Lost+and+Found+UI)

## ✨ Features

- **Report lost items** with a clean form including:
  - Item name, description, location, date, and contact info.
- **All new items are automatically marked as “Lost”**.
- **“Mark as Found” button** on each lost item card:
  - Changes status from “Lost” to “Found”.
  - Updates the badge color (red → green).
  - Button disappears after marking.
- **Persistent storage** – items remain after page refresh (using `localStorage`).
- **Empty state** – friendly message when no items have been reported yet.
- **Fully responsive** – works on desktop, tablet, and mobile.
- **Smooth hover effects** and soft shadows for a modern look.

## 🛠️ Tech Stack

- **HTML5** – structure
- **CSS3** – styling with Flexbox/Grid, custom properties, and modern UI
- **Vanilla JavaScript** – DOM manipulation, event handling, and localStorage
- **Google Fonts** – Inter font family

## 📁 Project Structure

lost-and-found/
├── index.html # Main HTML document
├── style.css # All styles (minimalist, responsive)
├── script.js # Application logic (no external libraries)
└── README.md # This file


## 🚀 Getting Started

### Prerequisites

- Any modern web browser (Chrome, Firefox, Safari, Edge)
- VS Code (optional, but recommended)

### Installation & Running

1. **Clone or download** the project files into a folder.
2. Make sure all three files (`index.html`, `style.css`, `script.js`) are in the same directory.
3. Open `index.html` in your browser:
   - **Double-click** the file, or
   - Use **Live Server** in VS Code (right-click `index.html` → “Open with Live Server”).
4. Start reporting lost items – no internet connection needed after loading.

> **Note:** Do **not** try to run `script.js` with Node.js – this is a frontend application that requires a browser environment.

## 📝 How to Use

1. **Report a lost item** – fill in all required fields and click “report lost item”. The item appears instantly at the top of the list.
2. **View reported items** – each card shows the name, description, location, date, and contact info.
3. **Mark as found** – click the “✓ mark as found” button on any lost item. The status changes to “Found”, the badge turns green, and the button disappears.
4. **Delete an item** – click the 🗑️ trash icon to permanently remove a report (confirmation dialog appears).

## 💾 Data Persistence

- All items are saved to your browser’s `localStorage` under the key `lnf_lost_found_items`.
- Data remains even after closing or refreshing the page.
- Clearing browser storage (or using private/incognito mode) will reset the data.

## 🎨 Design Highlights

- Neutral color palette: white, soft grays, and a muted accent.
- Card‑based layout with rounded corners (1.5rem).
- Subtle shadows and hover lift effects.
- Responsive grid that adapts to screen size.
- Accessible focus states for form inputs.

## 📄 License

This project is open‑source and available under the [MIT License](LICENSE).

## 🙌 Acknowledgments

- Fonts provided by [Google Fonts](https://fonts.google.com/) (Inter).
- Icons are Unicode symbols (no external icon libraries).

---

**Report what's lost, what's found.**

