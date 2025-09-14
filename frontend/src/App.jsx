import React from 'react'
import { BrowserRouter as Router, Route, Routes,Navigate } from 'react-router-dom'
import Home from './pages/Dashboard/Home'
import Income from './pages/Dashboard/Income'
import Expense from './pages/Dashboard/Expense'
import SignIn from './pages/auth/SignIn'
import SignUp from './pages/auth/SignUp'
import UserProvider from './context/UserContext'

function App() {

  return (
    <UserProvider>
    <div>
      <Router>
        <Routes>
          <Route path='/' element={<Root />} />
          <Route path='/income' element={<Income />} />
          <Route path='/expense' element={<Expense />} />
          <Route path='/login' element={<SignIn />} />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/dashboard' element={<Home />} />
        </Routes>
      </Router>

    </div>
    </UserProvider>
  )

}

export default App

const Root = () => {
  //check if token is present in local storage
  const isAuthenticated = localStorage.getItem('token');

  //Redirect to dashboard if authenticated else redirect to signin
  return isAuthenticated ? (<Navigate to="/dashboard" />) : (<Navigate to="/login" />);
}
