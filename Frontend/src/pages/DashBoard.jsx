import React, { useEffect, useRef, useState } from 'react';
import { useUserContext } from '../context/UserContext';
import { Menu } from 'lucide-react';
import axios from '../service/AxiosInstance';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const DashBoard = () => {
  const navigate = useNavigate();
  const { user, isLogin } = useUserContext();
  const [showHistory, setShowHistory] = useState(false);
  const recognitionRef = useRef(null);

const startSpeechRecognition = () => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    toast.error('Speech Recognition not supported in this browser');
    return;
  }

  if (recognitionRef.current) {
    recognitionRef.current.stop();
    recognitionRef.current = null;
  }

  const recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = 'en-US';

  recognition.onresult = (event) => {
    const transcript = Array.from(event.results)
      .map(result => result[0].transcript)
      .join('');
    console.log("Transcript:", transcript);
  };
  recognition.onerror = (event) => {
    console.error("❌ Speech recognition error:", event.error);
    toast.error(`Speech error: ${event.error}`);
  };

  recognition.onend = () => {
    console.warn("Speech recognition ended.");
  };

  recognition.start();
  recognitionRef.current = recognition;
  toast.success("🎤 Listening started...");
};


  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  if (!isLogin || !user) {
    return (
      <div className="flex items-center justify-center h-screen text-white">
        Loading user data...
      </div>
    );
  }

  const handleLogOut = async () => {
    await axios.get('/auth/logout')
      .then((res) => {
        toast.success("Logged out successfully");
        navigate('/auth/login');
      })
      .catch((err) => {
        toast.error("Failed to log out");
        console.error(err);
      });
  };

  const handleCustomize = () => {
    navigate('/customization/dummy');
  };

  const { userName, email, virtualAssistantName, virtualAssistantImage, searchHistory } = user;

  return (
    <div className="min-h-screen min-w-screen bg-gradient-to-br from-[#171717] via-[#131116] to-[#c272fb] text-white font-sans flex flex-col md:flex-row relative">

      {/* Toggle Button for Mobile */}
      <button
        className="md:hidden absolute top-4 left-4 z-50 bg-[#2a2a2a] p-2 rounded-md shadow-md"
        onClick={() => setShowHistory(prev => !prev)}
      >
        <Menu className="text-white w-6 h-6" />
      </button>

      {/* Sidebar */}
      <aside
        className={`bg-[#1f1f1f] text-white p-6 overflow-y-auto md:h-screen transition-all duration-300 z-40 
          ${showHistory ? 'absolute top-0 left-0 w-3/4 h-screen' : 'hidden'} 
          md:block md:static md:w-1/4`}
      >
        <h2 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2">Search History</h2>
        {searchHistory && searchHistory.length > 0 ? (
          <ul className="space-y-2">
            {searchHistory.map((item, index) => (
              <li
                key={index}
                className="bg-[#2a2a2a] rounded-lg p-3 hover:bg-[#3a3a3a] transition-all cursor-pointer"
              >
                {item}
              </li>
            ))}
          </ul>
        ) : (
          <p>No search history available.</p>
        )}
      </aside>

      {/* Main Content */}
      <main className="w-full md:w-3/4 relative flex flex-col items-center justify-center p-6 min-h-screen">
        {/* Top Right Buttons */}
        <div className="absolute top-6 right-6 flex flex-col items-end gap-3">
          <button onClick={handleCustomize} className="bg-[#9B7EBD] cursor-pointer hover:bg-[#bca3d6] text-white font-semibold py-2 px-5 rounded-2xl shadow-lg transition duration-300 ease-in-out">
            Customize Assistant
          </button>
          <button onClick={handleLogOut} className="bg-[#D93636] cursor-pointer hover:bg-[#f75e5e] text-white font-semibold py-2 px-5 rounded-2xl shadow-lg transition duration-300 ease-in-out">
            Logout
          </button>
          <button
            onClick={startSpeechRecognition}
            className="bg-[#3B1E54] hover:bg-[#5c3f77] text-white font-semibold py-2 px-5 rounded-2xl shadow-lg transition duration-300 ease-in-out"
          >
            🎤 Start Listening
          </button>
        </div>

        {/* Assistant Info */}
        <div className="text-center mt-12">
          {virtualAssistantImage && (
            <img
              src={virtualAssistantImage}
              alt="Assistant"
              className="w-40 h-40 sm:w-52 sm:h-52 rounded-full object-cover mx-auto shadow-lg border-4 border-[#EEEEEE]"
            />
          )}

          <h2 className="text-3xl sm:text-4xl font-bold mt-6">
            Hello, I’m <span className="text-[#D4BEE4]">{virtualAssistantName}</span> 👋
          </h2>
          <p className="mt-3 text-[#EEEEEE] text-lg sm:text-xl">
            I'm always here to assist you, {userName}.
          </p>
          <p className="mt-3 text-[#f096db] text-lg sm:text-xl">
            "say hey {virtualAssistantName}"
          </p>
        </div>
      </main>
    </div>
  );
};

export default DashBoard;
