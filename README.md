# 🍴 ChefMate – AI Powered Meal & Recipe Planner

ChefMate is an **AI-powered meal and recipe recommendation planner** built with the **MERN stack**. It helps users discover personalized meal plans, explore famous cuisines, and save recipes with ease.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-brightgreen)](your-vercel-url-here)
[![React](https://img.shields.io/badge/React-18.0+-61DAFB.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-16.0+-339933.svg)](https://nodejs.org/)

## 🚀 Features

- 🤖 **AI Recommendations** – Powered by **Mistral AI** to generate personalized meal and recipe suggestions
- 🌍 **Explore Global Cuisines** – Integrated with **TheMealDB API** to showcase famous cuisines around the world
- 📝 **Save Recipes & Meal Plans** – Users can save their favorite recipes and meal plans for quick access
- ⚡ **Seamless Frontend** – Built using **React.js** + **TailwindCSS** for a modern and responsive UI
- 🛠️ **Robust Backend** – Developed with **Node.js + Express.js** and **MongoDB** for efficient data management

## 🛠️ Tech Stack

| Category | Technologies |
|----------|-------------|
| **Frontend** | React.js, TailwindCSS |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB |
| **AI Integration** | Mistral AI using open router api |
| **External API** | TheMealDB API |
| **Deployment** | Vercel, Render |

## 📸 Screenshots

### Home Page
![ChefMate Home Page](https://res.cloudinary.com/dtogfz0uu/image/upload/v1756072056/Screenshot_2025-08-25_031404_fmcph0.png)

### Saved Recipes
![AI Meal Planning Interface](https://res.cloudinary.com/dtogfz0uu/image/upload/v1756072057/Screenshot_2025-08-25_031456_bgqxce.png)

### AI Meal Planner
![Global Cuisines Feature](https://res.cloudinary.com/dtogfz0uu/image/upload/v1756072057/Screenshot_2025-08-25_031537_ppoghp.png)

### AI Smart Recipe Generator
![Saved Recipes Interface](https://res.cloudinary.com/dtogfz0uu/image/upload/v1756072056/Screenshot_2025-08-25_031620_tuvob1.png)

## ⚙️ Installation & Setup

### Prerequisites

- Node.js (v16.0 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/chefmate.git
cd chefmate
```

### 2. Backend Setup

```bash
cd backend
npm install

# Create .env file and add your environment variables
cp .env.example .env

# Start the backend server
npm start
```

### 3. Frontend Setup

```bash
cd frontend
npm install

# Start the development server
npm run dev
```

### 4. Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
OPEN_ROUTER_API_KEY=your_open_router_api_key
THEMEALDB_API_URL=https://www.themealdb.com/api/json/v1/1
NODE_ENV=development
```

## 🚦 Usage

1. **Start the Backend**: Navigate to `/backend` and run `npm start`
2. **Start the Frontend**: Navigate to `/frontend` and run `npm run dev`
3. **Access the Application**: Open `http://localhost:3000` in your browser

## 📁 Project Structure

```
chefmate/
├── 📂 frontend/          # React.js frontend application
│   ├── 📂 src/
│   ├── 📂 public/
│   ├── 📄 package.json
│   └── 📄 tailwind.config.js
├── 📂 backend/           # Node.js backend application
│   ├── 📂 routes/
│   ├── 📂 models/
│   ├── 📂 controllers/
│   ├── 📄 server.js
│   └── 📄 package.json
├── 📄 README.md
└── 📄 LICENSE
```

## 🌟 API Endpoints

### Recipes
- `GET /api/recipes` - Get all recipes
- `POST /api/recipes` - Create a new recipe
- `GET /api/recipes/:id` - Get recipe by ID
- `DELETE /api/recipes/:id` - Delete recipe

### Meal Plans
- `GET /api/meal-plans` - Get user's meal plans
- `POST /api/ai/generate-meal-plan` - AI-generated meal plan

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📌 Future Improvements

- [ ] Support multiple languages for global users
- [ ] Mobile app development
- [ ] Integration with grocery delivery services
- [ ] Social features for sharing recipes

## 🙌 Acknowledgements

- [Mistral AI](https://mistral.ai/) – AI meal & recipe recommendations
- [TheMealDB](https://www.themealdb.com/) – Global cuisine API
- [MongoDB](https://www.mongodb.com/) – Database management
- [Vercel](https://vercel.com/) – Deployment platform

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨💻 Author

**Mayur Pawar** – Passionate Developer 🚀

- 🔗 [LinkedIn](https://www.linkedin.com/in/mayur-pawar-551a05278)
- 🔗 [GitHub](https://github.com/mayurCoder2004)
- 📧 [Email](mailto:mayursomnathpawar123@gmail.com)

---

⭐ **If you found this project helpful, please give it a star!** ⭐
