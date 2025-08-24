import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Profile from './pages/Profile'
import PrivateRoute from './components/PrivateRoute'
import RecipePage from './pages/RecipePage'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ErrorPage from './pages/ErrorPage'
import Recipes from './pages/Recipe'
import SmartRecipe from './pages/SmartRecipe'
import AiRecipePage from './pages/AiRecipePage'
import MealPlanner from './pages/MealPlanner'
import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <>
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      
      {/* Protected Route */}
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
      <Route path="/recipe/:id" element={<RecipePage />} />
      <Route path='/recipes' element={<Recipes />} />
      <Route path="/smart-recipe" element={<SmartRecipe />} />
      <Route path="/ai-recipe/:id" element={<AiRecipePage />} />
      <Route path='/meal-planner' element={<MealPlanner />} />

      {/* Catch-all route for 404 */}
      <Route path="*" element={<ErrorPage />} />
    </Routes>
    <Footer />
    <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          duration: 3000,
          style: {
            background: 'linear-gradient(135deg, #fed7aa, #fde68a)',
            color: '#92400e',
            fontWeight: '600',
            fontSize: '14px',
            borderRadius: '16px',
            border: '2px solid rgba(251, 146, 60, 0.3)',
            backdropFilter: 'blur(8px)',
            maxWidth: '400px',
          },
          success: {
            style: {
              background: 'linear-gradient(135deg, #d1fae5, #a7f3d0)',
              color: '#065f46',
              border: '2px solid rgba(34, 197, 94, 0.3)',
            },
          },
          error: {
            style: {
              background: 'linear-gradient(135deg, #fee2e2, #fecaca)',
              color: '#991b1b',
              border: '2px solid rgba(239, 68, 68, 0.3)',
            },
          },
          loading: {
            style: {
              background: 'linear-gradient(135deg, #e0e7ff, #c7d2fe)',
              color: '#3730a3',
              border: '2px solid rgba(99, 102, 241, 0.3)',
            },
          },
        }}
      />
    </>
  )
}

export default App