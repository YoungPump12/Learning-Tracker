road map on how i built this web app

1. Project Setup

Built a React frontend (with Vite).

Added pages: Landing, Login, Register, Dashboard.

Used React Router for navigation between pages.

2. Authentication Flow

Created:

Register page (user signup)

Login page (user signin)

Connected frontend to backend API.

Fixed:

Registration redirect to login.

Login redirect to dashboard.

Added token storage in localStorage.

3. Dashboard Features

Task creation and listing.

Task status (pending, in progress, completed).

Progress bar showing completion percentage.

Animated progress bar.

Status badges with colors.

Icons for actions.

Added Logout button that:

Clears token.

Redirects to login.

4. Styling & UI

Chose Calm / Productivity theme.

Used:

Tailwind CSS

Custom CSS (glassmorphism, soft background)

Added:

Glass cards

Soft gradients

Animations (fade-in, hover, transitions)

Responsive layout (mobile & desktop).

5. Landing Page

Built a professional animated HTML landing page.

Added:

Navbar with logo

Hero section

Feature cards

Buttons: Get Started, Create Account

Made it:

Responsive

Animated

Professional (SaaS style).

6. Deployment (cPanel)

Hosted React build on cPanel.

Moved React app into:

public_html/app


Put Landing page in:

public_html/index.html


Fixed asset loading using:

vite.config.js base = /app/

Added .htaccess to fix:

React Router refresh 404.

Linked landing page buttons to:

to login and register page 