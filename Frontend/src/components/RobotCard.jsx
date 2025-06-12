import React from 'react';

const RobotCard = ({ robotID, robotName, isSelected, onSelect }) => {
  return (
    <div
      className={`relative rounded-xl overflow-hidden cursor-pointer transition-all ${
        isSelected ? 'ring-4 ring-[#9B7EBD]' : 'hover:ring-2 hover:ring-[#9B7EBD]/50'
      }`}
      onClick={() => onSelect(robotID)}
    >
      <img
        src={robotName}
        alt={`Robot Avatar ${robotID}`}
        className="w-full h-full object-cover aspect-square"
      />
      {isSelected && (
        <div className="absolute inset-0 bg-[#9B7EBD]/30 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-[#9B7EBD] flex items-center justify-center">
            ✓
          </div>
        </div>
      )}
    </div>
  );
};

export default RobotCard;