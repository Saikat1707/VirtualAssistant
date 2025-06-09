import React from 'react'
import SignUp from '../components/SignUp'
import '../css/PagesCSS/Auth.css'
import Login from '../components/Login'

const AuthPage = () => {
  return (
    <div className='main_auth_container h-[100%] w-[100%] flex items-center justify-center'>
        {/* <SignUp/> */}
        <Login/>
    </div>
  )
}

export default AuthPage