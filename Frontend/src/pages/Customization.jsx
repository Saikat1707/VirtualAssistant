import React, { useEffect, useState } from 'react'
import RobotChoice from '../components/RobotChoice'
import RobotName from '../components/RobotName';

const Customization = () => {
  const [fileData, setFileData] = useState(null);
  const [name, setName] = useState("")
  useEffect(() => {
    if(fileData){
      console.log(fileData)
      console.log(name)
    }
  }, [fileData,name])
  
  return (
    <div className='h-[100%] w-[100%] flex-col items-center justify-center bg-gradient-to-br from-[#171717] via-[#131116] to-[#c272fb]'>
        <RobotChoice setFileData={setFileData}/>
        <RobotName setNameMain={setName} nameMain={name}/>
    </div>
  )
}

export default Customization