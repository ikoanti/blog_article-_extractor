# ⚡ Blog Article Extractor

An interactive, browser-based scraper and exporter utility. Paste it in your Developer Console on any blog listing page (WordPress, Shopify, Webflow, Medium, etc.) to scan and extract all article titles, URLs, publication dates, and author information across pagination. The scraped data can be exported directly into an Excel (`.xlsx`) or CSV (`.csv`) spreadsheet.

---

## Key Features

- **🚀 Live UI Overlay:** Glassmorphic float drawer displays active crawler progress, logs, and a tabular live preview.
- **🕵️‍♂️ Auto-Detection:** Automatically estimates article tags, title selectors, link tags, and next-page pagination selectors based on standard CMS architectures.
- **🔄 Draggable Panel:** Reposition the crawler panel anywhere on the screen out of the way.
- **🌐 Full CORS Bypass:** Bypasses Cross-Origin Resource Sharing (CORS) blocks because requests execute natively from the user's active browser context.
- **🔒 CSP-Resilient Export:** Attempts to fetch SheetJS (`xlsx.js`) from a CDN to build a structured Excel workbook. If the target website's Content Security Policy blocks external scripts, it falls back seamlessly to a UTF-8 BOM CSV download.

---

## Quick Start (Developer Console)

1. Navigate to the blog landing page of choice (e.g. `https://example.com/blog`).
2. Open your browser's Developer Tools:
   - **Windows/Linux:** Press `F12` or `Ctrl + Shift + I`
   - **Mac:** Press `Cmd + Option + I`
3. Click on the **Console** tab.
4. Paste the entire content of [scraper.js](file:///g:/My%20Drive/Antigrvity/blog-article-extractor/scraper.js) into the command prompt and press **Enter**.
5. The overlay dashboard will appear immediately on the top right.
6. Click **Auto-Detect** or tweak the selector inputs, and click **Start Crawling**.

---

## Save as Bookmarklet (Single-Click Execution)

To make it even faster, save the tool as a browser bookmarklet. This allows you to launch the scraper on any website with a single click in your Bookmarks bar.

### Bookmarklet Code:
Create a new bookmark in your browser and paste the following code into the **URL** (or **Location**) field:

```javascript
javascript:(function(){const%20s=document.createElement('script');s.src='https://cdn.jsdelivr.net/gh/yourusername/repo/blog-article-extractor/scraper.js';document.head.appendChild(s);})();
```
*Note: Alternatively, copy the raw code of [scraper.js](file:///g:/My%20Drive/Antigrvity/blog-article-extractor/scraper.js) and wrap it inside `javascript:(function(){ <PASTE_SCRAPER_CODE_HERE> })();` to run it purely locally without any external file reference!*

---

## Selector Reference Sheet

If auto-detection requires fine-tuning, here are reference selectors for popular CMS setups:

### 🛍️ Shopify
- **Article Container:** `article, .article-card, .blog-articles__article`
- **Title Selector:** `h2, .article-card__title, .article-template__title`
- **Link Selector:** `a` (or leave empty if Title is the anchor link)
- **Next Page Selector:** `a.pagination__next, [aria-label="Next page"], a[rel="next"]`

### 📝 WordPress
- **Article Container:** `article, .post, .entry`
- **Title Selector:** `.entry-title, .post-title, h2`
- **Link Selector:** `.entry-title a, a[rel="bookmark"]`
- **Next Page Selector:** `a.next, .nav-previous a, a[rel="next"]`

### 🕸️ Webflow
- **Article Container:** `.w-dyn-item, .blog-post-card`
- **Title Selector:** `h2, h3, .blog-title`
- **Link Selector:** `a`
- **Next Page Selector:** `.w-pagination-next`

---

## Development and Modification

To make modifications to the scraper logic or design:
- Open [scraper.js](file:///g:/My%20Drive/Antigrvity/blog-article-extractor/scraper.js) in your local workspace.
- The UI styling can be customized inside the template literal on line 22 (`#blog-scraper-overlay-ui`).
- Update selector lists or add specialized logic inside the crawler section.
