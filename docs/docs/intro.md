---
sidebar_position: 1
---

# ConflictCalendar Documentation

ConflictCalendar is a course scheduling application with conflict detection, built with React + TypeScript frontend and Express + MongoDB backend.

## Architecture Overview

### Backend (`/backend`)
- **Express.js API** with TypeScript
- **MongoDB** database with Mongoose ODM
- **JWT authentication** with password reset
- **Email service** for notifications

### Frontend (`/frontend`)
- **React 19** with TypeScript and Vite
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Zustand** for state management

## Core Features

- User authentication (register/login/reset password)
- Course CRUD operations with time/day scheduling
- Real-time conflict detection between courses
- Calendar visualization interface

## Quick Start

### Environment Setup
Create `.env` in the backend directory:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
EMAIL_HOST=your_smtp_host
EMAIL_PORT=587
EMAIL_USER=your_email_username
EMAIL_PASS=your_email_password
EMAIL_FROM=your_sender_email
```

### Development Commands
```bash
# Install dependencies
npm install
cd frontend && npm install

# Run development servers
npm run dev        # Backend on :5000
npm run dev:client # Frontend on :5173

# Build for production
npm run build      # Builds frontend to /dist
```

### Frontend
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **State Management**: Zustand
- **UI Components**: Custom components with Radix UI primitives
- **Styling**: Tailwind CSS
- **Calendar**: React Big Calendar

### Development & Deployment
- **Package Manager**: npm
- **Type Checking**: TypeScript
- **Linting**: ESLint
- **Deployment**: Render.com (configured for production)

## Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/hipranav7/ConflictCalendar.git
   cd ConflictCalendar
   ```

2. **Install dependencies**
   ```bash
   npm install
   npm install --prefix frontend
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start development**
   ```bash
   npm run dev
   ```

## Documentation Structure

This documentation is organized into several sections:

- **Getting Started**: Installation, configuration, and setup instructions
- **User Guide**: How to use the application features
- **Developer Guide**: Architecture, database schema, and development workflows
- **API Reference**: Detailed API documentation generated from code
- **Deployment**: Production deployment and configuration

## Contributing

We welcome contributions! Please see our [Developer Guide](developer-guide/architecture) for information on the codebase structure and development workflow.

## Support

If you encounter any issues or have questions, please:

1. Check the relevant documentation section
2. Search existing [GitHub Issues](https://github.com/hipranav7/ConflictCalendar/issues)
3. Create a new issue if needed

---

Ready to get started? Check out the [Installation Guide](installation) next!

Generate a new Docusaurus site using the **classic template**.

The classic template will automatically be added to your project after you run the command:

```bash
npm init docusaurus@latest my-website classic
```

You can type this command into Command Prompt, Powershell, Terminal, or any other integrated terminal of your code editor.

The command also installs all necessary dependencies you need to run Docusaurus.

## Start your site

Run the development server:

```bash
cd my-website
npm run start
```

The `cd` command changes the directory you're working with. In order to work with your newly created Docusaurus site, you'll need to navigate the terminal there.

The `npm run start` command builds your website locally and serves it through a development server, ready for you to view at http://localhost:3000/.

Open `docs/intro.md` (this page) and edit some lines: the site **reloads automatically** and displays your changes.
