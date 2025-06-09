import React, { useRef, useState } from "react";
import RobotCard from "./RobotCard";
import robot1 from "../assets/robot/robot1.jpg";
import robot2 from "../assets/robot/robot2.jpg";
import robot3 from "../assets/robot/robot3.jpg";
import robot4 from "../assets/robot/robot4.jpg";
import robot5 from "../assets/robot/robot7.jpg";
import robot6 from "../assets/robot/robot8.jpg";
import { FiUpload } from "react-icons/fi";

const robotDetails = [
  { robotName: robot1, robotId: 1 },
  { robotName: robot2, robotId: 2 },
  { robotName: robot3, robotId: 3 },
  { robotName: robot4, robotId: 4 },
  { robotName: robot5, robotId: 5 },
  { robotName: robot6, robotId: 6 },
];

const RobotChoice = ({ setFileData }) => {
  const fileInputRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedRobotId, setSelectedRobotId] = useState(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFileData(file);
    if (file && file.type.startsWith("image/")) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log("form submitted successfully");
  };

  return (
    <div className='flex flex-col w-full h-full items-center justify-center'>
      <h1 className="font-bold lg:text-2xl text-amber-500 sm:text-xl my-5">Select Your Virtual Assistant</h1>
      <form
        onSubmit={handleFormSubmit}
        className="w-[70%] px-4 py-8 sm:px-6 lg:px-10 flex flex-wrap justify-center items-center gap-6"
      >
        {robotDetails.map((robot) => (
          <RobotCard
            key={robot.robotId}
            robotID={robot.robotId}
            robotName={robot.robotName}
            setFileData={setFileData}
            isSelected={selectedRobotId === robot.robotId}
            setSelectedRobotId={setSelectedRobotId}
          />
        ))}

        <div
          className="rounded-lg h-[250px] w-[200px] border overflow-hidden flex items-center justify-center cursor-pointer"
          onClick={handleUploadClick}
        >
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
          />
          {selectedImage ? (
            <img
              src={selectedImage}
              alt="Uploaded Preview"
              className="object-cover w-full h-full"
            />
          ) : (
            <FiUpload className="text-4xl text-gray-400" />
          )}
        </div>
        <div>
          <button
            type="submit"
            className="bg-gray-100 text-black w-[200px] rounded-lg py-5 cursor-pointer font-bold border-2 border-transparent hover:border-amber-500"
          >
            Next
          </button>
        </div>
      </form>
    </div>
  );
};

export default RobotChoice;
