import React, { useEffect, useState } from 'react'
import RobotChoice from '../components/RobotChoice'
import RobotName from '../components/RobotName';
import axios from '../service/AxiosInstance'
import { toast } from 'react-toastify';
import { Outlet, useNavigate } from 'react-router-dom';
import { useUserContext } from '../context/UserContext';

const Customization = () => {
  const [fileData, setFileData] = useState(null);
  const [name, setName] = useState("")
  const {fetchUser} = useUserContext()
  const navigate = useNavigate()
  useEffect(() => {
    if(fileData && name){
      const formData = new FormData();
      formData.append('virtualAssistantName', name);
      formData.append('assistantImage', fileData);
      const formValues = Object.fromEntries(formData.entries())
      console.log(formValues)
      submitFinalForm(formData)
    }
  }, [fileData,name])

  const submitFinalForm = async (formData)=>{
    await axios.patch("/user/update",formData)
      .then((res)=>{
        console.log(res.data)
        toast.success("Virtual Assistant updated successfully!")
        fetchUser()
      })
      .catch((err)=>{
        console.log(err.response.data.message)
        toast.error(err.response.data.message)
        navigate("/customization/dummy")
      })
  }
  
  return (
    <div className='h-[100%] w-[100%] flex-col items-center justify-center bg-gradient-to-br from-[#171717] via-[#131116] to-[#c272fb]'>
        <Outlet context={{ setFileData, setNameMain: setName, nameMain: name }} />

    </div>
  )
}

export default Customization