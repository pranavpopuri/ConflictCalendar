# ConflictCalendar Documentation

This documentation site is built using [Docusaurus](https://docusaurus.io/), a modern static website generator, and includes API documentation generated with [TypeDoc](https://typedoc.org/).

## Documentation Structure

- **Getting Started**: Installation, configuration, and setup guides
- **User Guide**: How to use ConflictCalendar features
- **Developer Guide**: Architecture, database schema, and development workflows
- **API Reference**: Auto-generated API documentation from TypeScript code
- **Deployment**: Production deployment and configuration guides

## Local Development

### Prerequisites

- Node.js 18+ and npm
- ConflictCalendar project cloned locally

### Setup

```bash
# Install documentation dependencies
cd docs
npm install

# Install TypeDoc for API generation (from project root)
cd ..
npm install --save-dev typedoc typedoc-plugin-markdown
```

### Development Commands

```bash
# Generate API documentation
npm run docs:api

# Start documentation dev server
npm run docs:dev

# Build documentation for production
npm run docs:build

# Generate API docs and build site
npm run docs:full
```

### Development Server

```bash
npm run docs:dev
```

This starts a local development server at http://localhost:3000. Most changes are reflected live without restart.

## Building Documentation

### Generate API Documentation

API documentation is automatically generated from TypeScript source code:

```bash
npm run docs:api
```

This creates markdown files in `docs/docs/api/` from the backend and frontend TypeScript code.

### Build Static Site

```bash
npm run docs:build
```

Generates static content into the `build/` directory for deployment.

## Documentation Content

### Adding New Documentation

1. **User Guides**: Add `.md` files to `docs/docs/user-guide/`
2. **Developer Guides**: Add `.md` files to `docs/docs/developer-guide/`
3. **Deployment Guides**: Add `.md` files to `docs/docs/deployment/`

### Updating API Documentation

API documentation is automatically generated from TypeScript comments. To update:

1. Add/update JSDoc comments in source code
2. Run `npm run docs:api` to regenerate
3. Commit the updated API documentation

### Markdown Features

Docusaurus supports enhanced markdown features:

- Code blocks with syntax highlighting
- Admonitions (tips, warnings, notes)
- Tabs and callouts
- MDX for React components in markdown

## Configuration

### Docusaurus Configuration

Main configuration in `docusaurus.config.ts`:

- Site metadata and URLs
- Navigation structure
- Theme configuration
- Plugin settings

### Sidebar Configuration

Navigation structure in `sidebars.ts`:

- Documentation sections
- Auto-generated API reference
- Category groupings

### TypeDoc Configuration

API documentation settings in `../typedoc.json`:

- Source code entry points
- Output directory
- Theme and formatting options

## Deployment

### Production Build

```bash
# Full production build
npm run docs:full
```

This generates both API documentation and builds the static site.

### Hosting Options

The documentation can be deployed to:

- **GitHub Pages**: Free hosting for GitHub repositories
- **Netlify**: Automatic builds from Git
- **Vercel**: Zero-config static site hosting
- **Custom Server**: Serve the `build/` directory

### GitHub Pages Deployment

```bash
# Build and deploy to GitHub Pages
npm run build
npm run deploy
```

## Content Guidelines

### Writing Style

- Use clear, concise language
- Include code examples where appropriate
- Add screenshots for UI-related documentation
- Use consistent formatting and structure

### Code Examples

Always include working code examples:

````typescript
```typescript
// API usage example
const response = await fetch('/api/courses', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(courseData)
});
```
````

```bash
USE_SSH=true yarn deploy
```

Not using SSH:

```bash
GIT_USER=<Your GitHub username> yarn deploy
```

If you are using GitHub pages for hosting, this command is a convenient way to build the website and push to the `gh-pages` branch.
