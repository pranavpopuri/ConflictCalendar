---
sidebar_position: 1
---

# ConflictCalendar Documentation

Welcome to the ConflictCalendar documentation! This comprehensive guide will help you understand, deploy, and contribute to the ConflictCalendar application.

## What is ConflictCalendar?

ConflictCalendar is a full-stack web application designed to help users manage course schedules and detect scheduling conflicts. It provides an intuitive interface for course management with real-time conflict detection and calendar visualization.

## Key Features

- **User Authentication**: Secure user registration, login, and password reset functionality
- **Course Management**: Create, edit, and delete courses with detailed scheduling information
- **Conflict Detection**: Automatic detection of scheduling conflicts between courses
- **Calendar Visualization**: Interactive calendar interface using React Big Calendar
- **Email Integration**: Password reset via email with configurable SMTP providers
- **Responsive Design**: Modern UI built with React, TypeScript, and Tailwind CSS

## Technology Stack

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Email**: Nodemailer with support for Gmail, Mailtrap, and other SMTP providers
- **Validation**: Express Validator

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
