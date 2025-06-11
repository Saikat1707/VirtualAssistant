import React, { useState } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'

const RobotName = () => {
  const navigate = useNavigate()
  const {setNameMain,nameMain} = useOutletContext()

  const [name, setName] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Virtual Assistant Name:', name)
    setNameMain(name)
    navigate('/dashboard')
    
  }

  return (
    <div className="flex items-center justify-center px-4 py-10 bg-transparent">
      <form
        onSubmit={handleSubmit}
        className="backdrop-blur-xl  border border-white/20 rounded-2xl shadow-lg p-6 sm:p-10 w-full max-w-md"
      >
        <h2 className="text-xl sm:text-2xl font-semibold text-white text-center mb-6 tracking-wide">
          Name Your Virtual Assistant
        </h2>

        <div className="relative mb-6">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="peer w-full h-full px-4 pt-6 pb-2 text-white bg-transparent border border-white/30 rounded-lg placeholder-transparent focus:outline-none focus:ring-2 focus:ring-[#D4BEE4] focus:border-[#D4BEE4] transition duration-200"
            placeholder="Assistant Name"
          />
          <label className="absolute left-4 top-2 text-sm text-white/60 transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-placeholder-shown:text-white/40 peer-focus:top-2 peer-focus:text-sm peer-focus:text-[#D4BEE4]">
            Assistant Name
          </label>
        </div>

        <button
          type="submit"
          className="w-full py-3 cursor-pointer rounded-lg bg-[#D4BEE4] text-[#3B1E54] font-semibold text-sm tracking-wide hover:bg-[#eee] transition duration-300 shadow-md hover:shadow-lg"
        >
          Continue
        </button>
      </form>
    </div>
  )
}

export default RobotName
