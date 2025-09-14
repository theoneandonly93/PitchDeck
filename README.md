# PitchDeck

A modern documentation website with PowerPoint (.pptx) file support. PitchDeck provides a beautiful, responsive interface for uploading, viewing, and sharing PowerPoint presentations in a web-based documentation format.

## 🚀 Features

- **📤 Drag & Drop Upload**: Simply drag your .pptx files into the browser
- **📱 Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **🌙 Dark/Light Theme**: Toggle between themes for comfortable viewing
- **🔍 Search Functionality**: Find content quickly with built-in search
- **💻 Modern Interface**: Clean, professional documentation layout similar to docs.bananachain.io
- **🎯 PowerPoint Support**: Full support for .pptx file processing and viewing
- **⌨️ Keyboard Navigation**: Navigate slides with arrow keys and shortcuts
- **🖼️ Slide Thumbnails**: Visual slide navigation with thumbnail preview
- **📄 Multiple Presentations**: Upload and manage multiple presentation files

## 🛠️ Installation

### Quick Start

1. Clone the repository:
```bash
git clone https://github.com/theoneandonly93/PitchDeck.git
cd PitchDeck
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open your browser and navigate to `http://localhost:3000`

### Production Deployment

The site is a static web application and can be deployed to any static hosting service:

- **GitHub Pages**: Push to `main` branch and enable GitHub Pages
- **Netlify**: Connect your repository and deploy automatically
- **Vercel**: Import your GitHub repository
- **Firebase Hosting**: Use `firebase deploy`

## 📖 Usage

### Uploading Presentations

1. Navigate to the "Upload Presentation" section
2. Drag and drop your .pptx file or click "browse files"
3. Wait for the file to process (typically 1-3 seconds)
4. View your presentation in the "Presentation Viewer"

### Viewing Presentations

- **Navigation**: Use Previous/Next buttons or arrow keys
- **Thumbnails**: Click on slide thumbnails for quick navigation
- **Fullscreen**: Click on a slide image to enter fullscreen mode
- **Keyboard Shortcuts**:
  - `←/↑`: Previous slide
  - `→/↓/Space`: Next slide
  - `Home`: First slide
  - `End`: Last slide
  - `F/F11`: Toggle fullscreen
  - `Esc`: Exit fullscreen

### Theme Toggle

Click the theme toggle button in the header to switch between light and dark modes. Your preference is automatically saved.

## 🔧 Configuration

### File Upload Limits

- **Maximum file size**: 50MB
- **Supported formats**: .pptx (PowerPoint 2007+)
- **Multiple files**: Yes, upload multiple presentations

### Customization

The application uses CSS custom properties (variables) for easy theming:

```css
:root {
    --primary-color: #2563eb;
    --bg-primary: #ffffff;
    --text-primary: #0f172a;
    /* ... more variables */
}
```

## 🏗️ Architecture

### Frontend Stack

- **HTML5**: Semantic markup with accessibility features
- **CSS3**: Modern CSS with custom properties and grid/flexbox
- **Vanilla JavaScript**: No framework dependencies for better performance
- **Web APIs**: File API, Drag & Drop API, Fullscreen API

### File Processing

The application includes a PowerPoint processing system:

```javascript
// Example usage
const processor = new PPTXProcessor();
const presentation = await processor.processFile(file);
```

### Module Structure

- `assets/js/main.js`: Core application logic
- `assets/js/presentation.js`: Slide viewer functionality
- `assets/js/pptx-processor.js`: PowerPoint file processing
- `assets/css/style.css`: Responsive styles and theming

## 🧪 Development

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run linting
npm run lint

# Format code
npm run format
```

### Adding Features

1. **New slide viewer features**: Extend `PresentationViewer` class
2. **File processing**: Enhance `PPTXProcessor` class
3. **UI components**: Add to `assets/css/style.css`
4. **Navigation**: Update sidebar in `index.html`

### Browser Support

- Modern browsers (Chrome 80+, Firefox 75+, Safari 13+, Edge 80+)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Progressive enhancement for older browsers

## 📝 API Reference

### PPTXProcessor

```javascript
const processor = new PPTXProcessor();

// Process a file
const presentation = await processor.processFile(file);

// Get supported formats
const formats = processor.getSupportedFormats();
```

### PresentationViewer

```javascript
// Load a presentation
PresentationViewer.load(presentationData);

// Navigate slides
PresentationViewer.nextSlide();
PresentationViewer.previousSlide();
PresentationViewer.goToSlide(slideNumber);
```

## 🚀 Deployment

### GitHub Pages

The repository includes a GitHub Actions workflow for automatic deployment:

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages
on:
  push:
    branches: [ main ]
```

### Static Hosting

Build the project and upload the files to any static hosting service:

```bash
npm run build
# Upload dist/ folder to your hosting service
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Inspired by modern documentation sites like docs.bananachain.io
- Icons from Font Awesome
- Fonts from Google Fonts (Inter)
- Color palette inspired by Tailwind CSS

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/theoneandonly93/PitchDeck/issues) page
2. Create a new issue with detailed information
3. Join our community discussions

---

**Built with ❤️ for better presentation sharing**