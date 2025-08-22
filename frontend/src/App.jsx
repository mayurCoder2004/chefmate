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

      {/* Catch-all route for 404 */}
      <Route path="*" element={<ErrorPage />} />
    </Routes>
    <Footer />
    </>
  )
}

export default App