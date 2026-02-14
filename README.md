# Personal Academic Website

Personal website for Davide Cantavenera - Assistant Researcher in Visual Perception & Cognitive Neuroscience.

🌐 **Live Site**: https://davidecantavenera.github.io/Landing_Page

## Features

- 📝 **Dynamic Blog System** - Write posts in Markdown, auto-convert to HTML
- 🔗 **GitHub Integration** - Automatically fetch and display public repositories
- 🎨 **Modern Design** - Glass-morphism UI with smooth animations
- 📱 **Fully Responsive** - Works on all devices
- ⚡ **Fast & Lightweight** - Pure HTML/CSS/JS, no frameworks

## Structure

```
├── index.html              # Main website
├── assets/                 # Static resources
│   ├── css/style.css      # Styles
│   ├── js/main.js         # JavaScript
│   ├── img/               # Images
│   └── files/             # Documents (CV, etc.)
├── _posts/                 # Blog posts (Markdown)
├── blog/                   # Blog system
│   ├── editor.html        # Visual Markdown editor
│   └── build-blog.js      # Build script
└── github-repos.js         # GitHub API integration
```

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Create a Blog Post
- Open `blog/editor.html` in browser
- Write your post with live preview
- Save the `.md` file to `_posts/`

### 3. Build Blog
```bash
npm run build:blog
```

### 4. Update GitHub Repos
```bash
npm run update:repos
```

## Development

### Watch Mode (Auto-rebuild)
```bash
npm run watch:blog
```
Automatically rebuilds blog when you modify files in `_posts/`

### Scripts
- `npm run build:blog` - Convert Markdown posts to HTML
- `npm run watch:blog` - Watch for changes and auto-rebuild
- `npm run update:repos` - Fetch latest GitHub repositories

## Deployment

See [DEPLOY.md](DEPLOY.md) for detailed deployment instructions to GitHub Pages.

Quick deploy:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/davidecantavenera/Landing_Page.git
git push -u origin main
```

Then enable GitHub Pages in repository settings.

## Customization

### Update Personal Info
Edit `index.html`:
- Line 8: Page title
- Line 111-115: Hero section
- Line 82-88: Social links

### Change Colors
Edit `assets/css/style.css`:
- Lines 4-16: CSS variables for colors

### Add Sections
Follow the existing section structure in `index.html`

## Technologies

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Animations**: AOS (Animate On Scroll)
- **Particles**: tsParticles
- **Markdown**: Marked.js
- **Build**: Node.js

## License

© 2024 Davide Cantavenera. All rights reserved.

## Contact

- GitHub: [@davidecantavenera](https://github.com/davidecantavenera)
- Email: davide.cantavenera@studenti.unipd.it
