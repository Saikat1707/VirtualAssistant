import React from 'react'
import '../src/App.css'
import AuthPage from './pages/AuthPage'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import Customization from './pages/Customization'
import { Route, Routes } from 'react-router-dom'
import SignUp from './components/SignUp'
import Login from './components/Login'
import RobotChoice from './components/RobotChoice'
import RobotName from './components/RobotName'
import DashBoard from './pages/DashBoard'
import TestMic from './components/TestMic'
const App = () => {
  return (
    <div className="flex items-center justify-center ">
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        pauseOnHover
        draggable
        closeButton={false}
        limit={3}
        theme="light"
      />


      <Routes>
        <Route path='/auth/' element={<AuthPage/>}>
          <Route path='signup' element={<SignUp/>}/>
          <Route path='login' element={<Login/>}/>
        </Route>
        <Route path='/customization/' element={<Customization/>}>
          <Route path='dummy' element={<RobotChoice/>}/>
          <Route path='name' element={<RobotName/>}/>
        </Route>
        <Route path='/' element={<DashBoard/>}/>
      </Routes>
    </div>

  )
}

export default App