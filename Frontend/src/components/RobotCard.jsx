import React from 'react'

const RobotCard = ({ robotID,robotName, setFileData,setSelectedRobotId,isSelected }) => {
  const borderStyle = isSelected ? 'border-white' : 'border-transparent'
  const handleRobotChoose = async () => {
    try {
      const response = await fetch(robotName)
      const blob = await response.blob()
      const file = new File([blob], 'robot.jpg', { type: blob.type })
      setFileData(file)
      setSelectedRobotId(robotID)
      // console.log('Robot chosen:', file)
    } catch (error) {
      console.error('Error fetching robot image:', error)
    }
  }

  return (
    <div
      onClick={handleRobotChoose}
      className={`rounded-lg h-[250px] w-[200px] cursor-pointer overflow-hidden border-3 ${borderStyle} hover:border-white transition duration-300`}
    >
      <img
        className='w-full h-full object-cover rounded-lg'
        src={robotName}
        alt='robot'
      />
    </div>
  )
}

export default RobotCard
