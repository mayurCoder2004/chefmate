# ChefMate - AI Recipe Finder

ChefMate is a full-stack AI-powered recipe discovery and meal-planning application. It allows users to generate smart recipes based on ingredients they have, save their favorite recipes, and organize meal plans, all while providing a seamless, modern user interface.

## Features

- **AI-Powered Recipe Generation**: Generate complete, structured recipes from a list of ingredients, dietary preferences, and time constraints using AI (powered by OpenRouter/Mistral).
- **Smart Fallbacks**: Reliable local fallback recipes when AI services are rate-limited or unavailable.
- **User Authentication**: Secure user registration and login using JWT and bcrypt.
- **Recipe Management**: Save, view, and manage your favorite recipes.
- **Meal Planning**: Organize recipes into daily or weekly meal plans.
- **Responsive UI**: Modern, fast, and responsive user interface built with React, Vite, and Tailwind CSS.

## Tech Stack

### Frontend
- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast
- **Linting**: ESLint

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose)
- **Authentication**: JSON Web Tokens (JWT) & bcryptjs
- **Validation**: Zod
- **AI Integration**: OpenRouter API (`@google/genai` & `@google/generative-ai` SDKs supported)

## Project Structure

```text
ai-recipe-finder/
├── backend/                  # Node.js Express Server
│   ├── config/               # Database and environment configurations
│   ├── controllers/          # Request handlers for routes
│   ├── middlewares/          # Custom middlewares (e.g., auth verification)
│   ├── models/               # MongoDB Mongoose schemas (User, Recipe, etc.)
│   ├── routes/               # Express API route definitions
│   ├── services/             # Third-party services (OpenRouter AI integration)
│   ├── server.js             # Main backend application entry point
│   └── package.json          # Backend dependencies and scripts
│
├── frontend/                 # React UI (Vite)
│   ├── public/               # Static assets
│   ├── src/                  # React source code (Components, Pages, Hooks, Utils)
│   ├── package.json          # Frontend dependencies and scripts
│   ├── tailwind.config.js    # Tailwind CSS configuration
│   └── vite.config.js        # Vite build tool configuration
│
└── README.md                 # Project documentation
```

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB (Local instance or MongoDB Atlas cluster)
- OpenRouter API Key (for AI recipe generation)

### 1. Clone the repository

```bash
git clone https://github.com/mayurCoder2004/chefmate.git
cd ai-recipe-finder
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory based on the following template:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
OPENROUTER_API_KEY=your_openrouter_api_key
```

Start the backend development server:

```bash
npm run dev
```
The server will run on `http://localhost:5000`.

### 3. Frontend Setup

Open a new terminal and navigate to the frontend directory:

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend/` directory if necessary (e.g., for API URLs):

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend development server:

```bash
npm run dev
```
The frontend will run on the URL provided by Vite (usually `http://localhost:5173`).

## Core API Endpoints

- **Auth**: `POST /api/auth/register`, `POST /api/auth/login`
- **Recipes**: `GET /api/recipes`, `POST /api/recipes`, etc.
- **Meal Plans**: `GET /api/meal-plan`, `POST /api/meal-plan`, etc.
- **AI Smart Recipe**: `POST /api/smart-recipe` (Accepts ingredients, dietary preferences, and max time)

## License

This project is licensed under the ISC License.
