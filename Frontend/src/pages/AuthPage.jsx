import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthPage = () => {
  return (
    <div className=" main_auth_container min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-[#1511337b] via-[#302b63b4] to-[#24243e7d] relative overflow-hidden">
      

      {/* Main content container */}
      <div className="relative z-10 w-full max-w-lg">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthPage;