import React from 'react'
import SignUp from '../components/SignUp'
import '../css/PagesCSS/Auth.css'
import Login from '../components/Login'
import { Outlet } from 'react-router-dom'

const AuthPage = () => {
  return (
    <div className='main_auth_container h-[100%] w-[100%] flex items-center justify-center'>
      <Outlet/>
    </div>
  )
}

export default AuthPage