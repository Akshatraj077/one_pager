# Optigears — Pixel-Perfect Figma Rebuild

A complete, production-ready, one-page static website for **Optigears (JRB Engineering Works)** — pixel-perfect rebuild of the Figma design with a white (#FFFFFF) and deep blue (#264E87) color scheme.

## 🚀 How to Open Locally
1. Download or clone this folder to your computer.
2. Double-click `index.html` to open it in your default browser.
3. No build tools, server, or dependencies required!

## 🌐 How to Deploy on Netlify (Drag and Drop)
1. Go to [Netlify Drop](https://app.netlify.com/drop).
2. Create a free account or log in.
3. Drag and drop this entire folder into the designated area.
4. Netlify will publish your site and provide a live URL in seconds.

---

## 🛠️ Where to Replace Credentials & Links

### EmailJS (Contact Form)
1. Sign up at [emailjs.com](https://www.emailjs.com/) and create a service + template.
2. Open `js/main.js` and search for `YOUR_PUBLIC_KEY`, `YOUR_SERVICE_ID`, `YOUR_TEMPLATE_ID`.
3. Replace them with your actual keys (3 locations total).

### Social Media Links
Search `index.html` for `<!-- REPLACE:` comments:
- **Instagram URL** — in the navbar Row 1 social icons area
- **Facebook URL** — already set, verify it's correct

### Logo Image
The logo currently uses `assets/images/logo.jpg` fetched from optigears.com.
To use your own: replace the file at `assets/images/logo.jpg` or update the `src` attribute in `index.html`.

### ISO Certificate Image
Search `index.html` for `iso-cta__cert-placeholder` — replace the entire placeholder `<div>` with an `<img>` tag pointing to your certificate scan.

### Person/Team Image (Contact Section)
Search for `contact-deco__arch` — add a cutout image of a team member overlaying the decorative arch.

---

## 📁 File Structure
```
optigears/
├── index.html       ← All 12 sections
├── css/
│   └── style.css    ← All custom styles (arch shapes, blobs, carousels, responsive)
├── js/
│   └── main.js      ← Navbar, sliders, carousels, counters, i18n (7 languages), EmailJS
├── assets/
│   └── images/      ← Product images fetched from optigears.com
└── README.md
```

## 🎨 Color Scheme
- White `#FFFFFF` (replaces beige/skin tones)
- Deep Blue `#264E87` (replaces dark brown/taupe/orange)
- Warm cream `#EDE8DC` cards (kept for contrast)
- Light grey `#E8E8DF` arch cards (kept)

## 🌍 Languages
English, Español, Français, Deutsch, हिन्दी, العربية, 中文 — with RTL support for Arabic.
