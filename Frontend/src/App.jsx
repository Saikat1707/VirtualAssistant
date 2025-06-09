import React from 'react'
import '../src/App.css'
import AuthPage from './pages/AuthPage'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import Customization from './pages/Customization'
const App = () => {
  return (
    <div className="flex items-center justify-center lg:h-screen md:h-auto">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
      {/* <AuthPage /> */}
      <Customization />
    </div>

  )
}

export default App