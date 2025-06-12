import React, { useRef, useState } from "react";
import RobotCard from "./RobotCard";
import robot1 from "../assets/robot/robot1.jpg";
import robot2 from "../assets/robot/robot2.jpg";
import robot3 from "../assets/robot/robot3.jpg";
import robot4 from "../assets/robot/robot4.jpg";
import robot5 from "../assets/robot/robot7.jpg";
import robot6 from "../assets/robot/robot8.jpg";
import { FiUpload, FiArrowRight } from "react-icons/fi";
import { useNavigate, useOutletContext } from "react-router-dom";

const robotDetails = [
  { robotName: robot1, robotId: 1 },
  { robotName: robot2, robotId: 2 },
  { robotName: robot3, robotId: 3 },
  { robotName: robot4, robotId: 4 },
  { robotName: robot5, robotId: 5 },
  { robotName: robot6, robotId: 6 },
];

const RobotChoice = () => {
  const navigate = useNavigate();
  const { setFileData } = useOutletContext();
  
  const fileInputRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedRobotId, setSelectedRobotId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type and size
    if (!file.type.startsWith("image/")) {
      alert('Please select an image file (JPEG, PNG, etc.)');
      return;
    }
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      alert('Image size should be less than 5MB');
      return;
    }

    setFileData(file);
    const imageUrl = URL.createObjectURL(file);
    setSelectedImage(imageUrl);
    setSelectedRobotId(null); // Deselect any robot when uploading custom image
  };

  const handleRobotSelect = (id) => {
    setSelectedRobotId(id);
    setSelectedImage(null); // Clear custom image when selecting a robot
    // Set the corresponding robot image as file data
    const selectedRobot = robotDetails.find(robot => robot.robotId === id);
    if (selectedRobot) {
      fetch(selectedRobot.robotName)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], `robot-${id}.jpg`, { type: 'image/jpeg' });
          setFileData(file);
        });
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!selectedImage && selectedRobotId === null) {
      alert('Please select an avatar or upload a custom image');
      return;
    }
    
    setIsLoading(true);
    // Simulate API call or processing
    setTimeout(() => {
      navigate('/customization/name');
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#171717] via-[#131116] to-[#c272fb] flex flex-col items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-6xl bg-[#1f1f1f]/90 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden border border-[#333]/50">
        {/* Header */}
        <div className="p-6 border-b border-[#333]/50">
          <h1 className="text-2xl md:text-3xl font-bold text-center text-white">
            Choose Your Assistant Avatar
          </h1>
          <p className="text-center text-gray-400 mt-2">
            Select a pre-designed avatar or upload your own image
          </p>
        </div>

        {/* Main Content */}
        <form onSubmit={handleFormSubmit} className="p-6 md:p-8">
          {/* Robot Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            {robotDetails.map((robot) => (
              <RobotCard
                key={robot.robotId}
                robotID={robot.robotId}
                robotName={robot.robotName}
                isSelected={selectedRobotId === robot.robotId}
                onSelect={handleRobotSelect}
              />
            ))}
          </div>

          {/* Upload Section */}
          <div className="mb-8">
            <div className="flex flex-col items-center">
              <div
                className={`relative rounded-xl h-48 w-full max-w-xs border-2 border-dashed ${
                  selectedImage ? 'border-[#9B7EBD]' : 'border-gray-600'
                } flex items-center justify-center cursor-pointer transition-all hover:border-[#9B7EBD] overflow-hidden`}
                onClick={handleUploadClick}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileChange}
                  accept="image/*"
                />
                {selectedImage ? (
                  <>
                    <img
                      src={selectedImage}
                      alt="Uploaded Preview"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <FiUpload className="text-2xl text-white" />
                      <span className="text-white ml-2">Change Image</span>
                    </div>
                  </>
                ) : (
                  <div className="text-center p-4">
                    <FiUpload className="text-3xl text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-400">Click to upload</p>
                    <p className="text-xs text-gray-500 mt-1">JPG, PNG (Max 5MB)</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={(!selectedImage && selectedRobotId === null) || isLoading}
              className="px-6 py-3 bg-[#9B7EBD] hover:bg-[#bca3d6] text-white font-medium rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                'Processing...'
              ) : (
                <>
                  Continue <FiArrowRight />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RobotChoice;