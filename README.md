# LnF – Lost and Found Web

A modern, minimalist web application that helps users report lost items and mark them as found. All data is stored locally in the browser using `localStorage`, so no backend or database is required.


## Deploy Here:
https://lnf-lost-and-found.vercel.app

## ✨ Features

- **Report lost items** with a clean form containing:
  - Item name, description, location, date, contact info
  - **Image upload** (JPEG, PNG) – preview before submission
- **All new items start as “Lost”** (red badge).
- **“Mark as Found” button** on each card:
  - Changes status to “Found” (green badge)
  - Button becomes disabled
- **Image persistence** – uploaded images are converted to Base64 and stored in `localStorage`, so they survive page reloads.
- **Empty state** – first-time users see “No lost items reported yet.”
- **Fully responsive** – works on desktop, tablet, and mobile.
- **Smooth hover animations** and modern card design.

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
- VS Code (recommended, but not required)

### Installation & Running

1. **Download or clone** the three files into a folder.
2. Make sure `index.html`, `style.css`, and `script.js` are in the same directory.
3. Open `index.html` in your browser:
   - Double‑click the file, or
   - Use **Live Server** in VS Code (right‑click → “Open with Live Server”).
4. The application starts **empty** – no sample data. Report your first lost item!

> **Note:** This is a frontend application; do **not** try to run `script.js` with Node.js. The browser is required.

## 📝 How to Use

1. **Report a lost item**
   - Fill in all required fields (name, location, date, contact, description).
   - Optionally upload an image (JPG, PNG, JPEG) – a preview appears.
   - Click “report lost item”. The card appears instantly at the top of the list.

2. **View items**
   - Each card shows: uploaded image (or a placeholder), item name, description, location, date, contact info, and a status badge (red = LOST).

3. **Mark as found**
   - Click the **“mark as found”** button on any lost item.
   - Status changes to **FOUND** (green badge), and the button becomes disabled.
   - The change is saved in `localStorage` immediately.

4. **Delete an item**
   - Click the 🗑️ trash icon on any card.
   - Confirm deletion – the item is permanently removed.

## 🖼️ Image Upload Details

- Accepts `image/jpeg`, `image/png`, `image/jpg`.
- Image is converted to a **Base64 string** using the FileReader API.
- The Base64 data is stored directly in `localStorage` alongside the item.
- When the page reloads, images are restored and displayed in the cards.
- If no image is uploaded, a camera emoji placeholder is shown.

## 💾 Data Persistence

- All items (including images) are saved under the key `reclaim_lost_found_img`.
- Data remains after refreshing or closing the browser.
- To reset the app, clear your browser’s local storage for this site.

## 🎨 Design Highlights

- Neutral color palette: white, soft grays, muted blue‑gray accents.
- Card‑based layout with rounded corners (1.5rem) and soft shadows.
- Hover effects: cards lift slightly, buttons change color.
- Responsive grid – cards stack on mobile.
- Clean typography using the **Inter** font.

## 📄 License

This project is open‑source and available under the [MIT License](LICENSE).

## 🙌 Acknowledgments

- [Google Fonts](https://fonts.google.com/) – Inter font
- Icons are Unicode symbols (no external libraries)

---

**Report lost items, attach a photo, and mark them found – all in your browser
 ✨**  

