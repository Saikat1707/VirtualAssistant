import React, { useEffect, useState } from 'react';
import axios from '../service/AxiosInstance';
import { toast } from 'react-toastify';
import { Outlet, useNavigate } from 'react-router-dom';
import { useUserContext } from '../context/UserContext';
import { Loader2 } from 'lucide-react';

const Customization = () => {
  const [fileData, setFileData] = useState(null);
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { fetchUser, user } = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (fileData && name) {
      handleSubmit();
    }
  }, [fileData, name]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('virtualAssistantName', name.trim());
    formData.append('assistantImage', fileData);

    try {
      await axios.patch("/user/update", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      toast.success("Your virtual assistant has been updated successfully!");
      await fetchUser();
      navigate("/");
    } catch (err) {
      console.error("Update error:", err);
      toast.error(err.response?.data?.message || "Failed to update assistant");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#171717] via-[#131116] to-[#c272fb] text-white overflow-auto">
      <div className="container mx-auto px-4 py-8 md:py-12 flex flex-col items-center justify-start min-h-[calc(100vh-80px)]">
        {/* Header Section */}
        <header className="w-full text-center mb-8 md:mb-12 pt-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Customize Your Assistant
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Personalize your virtual assistant with a unique name and avatar
          </p>
        </header>

        {/* Main Content Area */}
        <div className="w-full max-w-4xl bg-[#1f1f1f]/90 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden border border-[#333]/50 mb-8">
          {/* Progress Indicator */}
          <div className="h-1 bg-[#333] w-full">
            <div 
              className={`h-full bg-[#9B7EBD] transition-all duration-500 ${
                (fileData && name) ? 'w-full' : 'w-1/2'
              }`}
            ></div>
          </div>

          {/* Content Container */}
          <div className="p-6 md:p-8">
            <Outlet context={{ 
              setFileData, 
              setNameMain: setName, 
              nameMain: name,
              currentImage: user?.virtualAssistantImage,
              currentName: user?.virtualAssistantName
            }} />
          </div>

          {/* Footer Navigation */}
          <div className="px-6 pb-6 md:px-8 md:pb-8 flex justify-between border-t border-[#333]/50 pt-6">
            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-2 rounded-lg bg-[#333]/80 hover:bg-[#444] transition-colors"
            >
              Back to Dashboard
            </button>
            
            {(fileData && name) && (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-6 py-2 rounded-lg bg-[#9B7EBD] hover:bg-[#bca3d6] transition-colors flex items-center gap-2 disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            )}
          </div>
        </div>

        {/* Help Text */}
        <div className="text-center text-sm text-gray-400 max-w-2xl pb-8">
          <p>
            Your assistant will use this identity throughout the application. 
            You can change these settings anytime.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Customization;