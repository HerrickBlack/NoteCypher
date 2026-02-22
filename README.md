# NoteCypher - PDF Note Optimizer

A free, local PDF optimization tool for students. All processing happens in your browser - no files are ever sent to a server.
Made For Students to make their Life Amazing !!

## Features

- **Multiple PDF Upload** - Drag & drop or select multiple PDF files
- **Interactive Thumbnails** - Click to select/deselect individual pages or entire PDFs
- **Filters**:
  - 🌓 **Invert Colors** - Convert dark-themed slides to print-friendly white background
  - ✨ **Clear Background** - Remove gray tints, yellowing, or scanner noise
  - ⚫ **Black & White** - Convert to pure grayscale for ink saving
- **Flexible Grid Layout** - Arrange 1, 2, 3, 4, or 6 slides per page
- **Custom Options** - Portrait/Landscape orientation, adjustable margins (0-5cm)
- **Dark Mode** - Toggle button in header, persists to localStorage
- **100% Local Processing** - Your files never leave your device
- **Memory Optimized** - Efficient thumbnail rendering with automatic cleanup

## Deployment to GitHub Pages

### Quick Deploy (Windows)

Run the deployment script:

```bash
deploy.bat
```

Follow the prompts to:
1. Enter your GitHub username
2. Create a repository on GitHub
3. Push and deploy

### Manual Deploy

```bash
# Install gh-pages
npm install --save-dev gh-pages

# Update package.json with your GitHub username
# "homepage": "https://YOUR_USERNAME.github.io/NoteCypher"

# Build and deploy
npm run deploy
```

### Enable GitHub Pages

1. Go to your repository → **Settings** → **Pages**
2. Select **gh-pages** branch and **/ (root)** folder
3. Click **Save**

Your site will be live at: `https://YOUR_USERNAME.github.io/NoteCypher/`

See [DEPLOY.md](DEPLOY.md) for detailed instructions.

## Development

```bash
npm install
npm run dev
```

This starts a development server at `http://localhost:3000`

## Project Structure

```
NoteCypher/
├── public/
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── HowItWorks.jsx
│   │   ├── UploadSection.jsx
│   │   ├── OptionsSection.jsx
│   │   ├── ThumbnailsSection.jsx
│   │   ├── ProgressSection.jsx
│   │   └── ExportSection.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── vite.config.js
```

## Technologies Used

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling with dark mode support
- **PDF.js (CDN)** - PDF rendering for thumbnails
- **PDF-lib (CDN)** - PDF generation and manipulation

## Usage

1. **Upload PDFs** - Drag & drop files or click to browse (supports multiple files)
2. **Select Pages** - Click individual thumbnails or click PDF headers to toggle all pages from that file
3. **Apply Filters** - Choose from invert, clear background, or black & white
4. **Set Layout** - Select slides per page (1, 2, 3, 4, or 6)
5. **Configure** - Set orientation and margins
6. **Export** - Download your optimized PDF

## Performance Optimizations

- **Lazy thumbnail loading** - Pages are rendered progressively with progress feedback
- **Memory-efficient storage** - Thumbnails stored as compressed JPEG data URLs
- **Automatic cleanup** - Canvas elements are released after rendering
- **CDN libraries** - PDF.js and PDF-lib loaded from CDN for faster initial load

## License

MIT - Free for personal and commercial use
