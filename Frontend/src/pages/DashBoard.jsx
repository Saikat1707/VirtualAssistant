import React, { useEffect, useState, useRef } from 'react';
import { useUserContext } from '../context/UserContext';
import { Menu, Mic, MicOff, Loader2 } from 'lucide-react';
import axios from '../service/AxiosInstance';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { geminiQuery } from '../service/GeminiService';

const DashBoard = () => {
  const navigate = useNavigate();
  const { user, isLogin, speak, fetchUser } = useUserContext();
  const [showHistory, setShowHistory] = useState(false);
  const [geminiResponse, setGeminiResponse] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const historyRef = useRef(null);
  const { transcript, resetTranscript, listening, browserSupportsSpeechRecognition } = useSpeechRecognition();

  // Auto-scroll to bottom of history when new items are added
  useEffect(() => {
    if (historyRef.current) {
      historyRef.current.scrollTop = historyRef.current.scrollHeight;
    }
  }, [user?.searchHistory]);

  // Initialize speech recognition
  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      toast.error("Your browser does not support speech recognition.");
      return;
    }
    
    const startListening = async () => {
      try {
        await SpeechRecognition.startListening({ 
          continuous: true, 
          language: 'en-IN'
        });
      } catch (error) {
        console.error("Error starting speech recognition:", error);
        toast.error("Failed to start voice recognition");
      }
    };
    
    startListening();
    
    return () => {
      SpeechRecognition.stopListening();
    };
  }, [browserSupportsSpeechRecognition]);

  // Handle voice commands
  useEffect(() => {
    if (!transcript || !user?.virtualAssistantName || isProcessing) return;

    const wakeWords = [
      `hey ${user.virtualAssistantName.toLowerCase()}`, 
      `${user.virtualAssistantName.toLowerCase()}`
    ];
    
    const saidWakeWord = wakeWords.some(word => 
      transcript.toLowerCase().includes(word)
    );

    if (saidWakeWord) {
      const query = transcript
        .toLowerCase()
        .replace(new RegExp(wakeWords.join('|'), 'i'), '')
        .trim();

      if (!query) {
        speak("I didn't catch that. Please try again.");
        resetTranscript();
        return;
      }

      processQuery(query);
    }
  }, [transcript, user?.virtualAssistantName, isProcessing]);

  const processQuery = async (query) => {
    setIsProcessing(true);
    try {
      const result = await geminiQuery(query);
      speak(result);
      setGeminiResponse(result);
      await fetchUser(); // Refresh user data to update history
    } catch (error) {
      console.error("Gemini query error:", error);
      speak("Sorry, I encountered an error. Please try again.");
      toast.error(error.message);
    } finally {
      setIsProcessing(false);
      resetTranscript();
    }
  };

  const handleLogOut = async () => {
    try {
      await axios.get('/auth/logout');
      toast.success("Logged out successfully");
      navigate('/auth/login');
    } catch (err) {
      toast.error("Failed to log out");
      console.error(err);
    }
  };

  const handleCustomize = () => {
    navigate('/customization/dummy');
  };

  const toggleListening = async () => {
    try {
      if (listening) {
        await SpeechRecognition.stopListening();
        toast.info("Microphone muted");
      } else {
        await SpeechRecognition.startListening({ continuous: true, language: 'en-IN' });
        await SpeechRecognition.resetTranscript
        toast.info("Microphone active");
      }
    } catch (error) {
      console.error("Error toggling microphone:", error);
      toast.error("Failed to toggle microphone");
    }
  };

  if (!isLogin || !user) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-[#171717] via-[#131116] to-[#c272fb] text-white">
        <div className="animate-pulse flex items-center gap-2">
          <Loader2 className="animate-spin" />
          Loading user data...
        </div>
      </div>
    );
  }

  const { userName, virtualAssistantName, virtualAssistantImage, searchHistory } = user;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#171717] via-[#131116] to-[#c272fb] text-white font-sans flex flex-col md:flex-row relative overflow-hidden">
      
      {/* Mobile Menu Toggle */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-[#2a2a2a]/90 p-2 rounded-md shadow-lg backdrop-blur-sm"
        onClick={() => setShowHistory(prev => !prev)}
        aria-label="Toggle history"
      >
        <Menu className="text-white w-6 h-6" />
      </button>

      {/* Sidebar - Search History */}
      <aside
        className={`bg-[#1f1f1f]/95 backdrop-blur-sm md:backdrop-blur-none md:bg-[#1f1f1f] text-white p-6 overflow-y-auto transition-all duration-300 z-40 
          ${showHistory ? 'fixed inset-0 w-full h-screen' : 'hidden'} 
          md:block md:static md:w-1/4 md:h-screen`}
      >
        <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-2">
          <h2 className="text-xl font-bold">Search History</h2>
          {showHistory && (
            <button 
              onClick={() => setShowHistory(false)}
              className="md:hidden text-gray-400 hover:text-white"
            >
              ✕
            </button>
          )}
        </div>
        
        <div 
          ref={historyRef}
          className="h-[calc(100%-50px)] overflow-y-auto scrollbar-thin scrollbar-thumb-[#9B7EBD] scrollbar-track-[#2a2a2a] pr-2"
        >
          {searchHistory && searchHistory.length > 0 ? (
            <ul className="space-y-2">
              {[...searchHistory].reverse().map((item, index) => (
                <li
                  key={index}
                  className="bg-[#2a2a2a]/60 hover:bg-[#3a3a3a]/80 rounded-lg p-3 transition-all cursor-pointer backdrop-blur-sm md:backdrop-blur-none"
                  onClick={() => {
                    setGeminiResponse(item.response || item);
                    setShowHistory(false);
                  }}
                >
                  <p className="text-sm line-clamp-2">{item.query || item}</p>
                  {item.timestamp && (
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(item.timestamp).toLocaleString()}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400 italic">No search history yet.</p>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="w-full md:w-3/4 flex flex-col items-center justify-start p-4 md:p-8 min-h-screen relative">
        {/* Top Right Buttons */}
        <div className="absolute top-4 right-4 md:top-6 md:right-6 flex flex-col md:flex-row items-end gap-3 z-30">
          <button 
            onClick={handleCustomize} 
            className="bg-[#9B7EBD] hover:bg-[#bca3d6] text-white font-medium py-2 px-4 rounded-xl shadow-lg transition duration-200 ease-in-out transform hover:scale-105 active:scale-95 text-sm md:text-base"
          >
            Customize
          </button>
          <button 
            onClick={handleLogOut} 
            className="bg-[#D93636]/90 hover:bg-[#f75e5e] text-white font-medium py-2 px-4 rounded-xl shadow-lg transition duration-200 ease-in-out transform hover:scale-105 active:scale-95 text-sm md:text-base"
          >
            Logout
          </button>
        </div>

        {/* Assistant Section */}
        <div className="w-full max-w-3xl flex flex-col items-center mt-16 md:mt-24 px-4">
          {/* Assistant Avatar */}
          <div className="relative group">
            {virtualAssistantImage ? (
              <img
                src={virtualAssistantImage}
                alt="Assistant"
                className="w-28 h-28 sm:w-36 sm:h-36 rounded-full object-cover mx-auto shadow-xl border-4 border-[#EEEEEE]/50 group-hover:border-[#D4BEE4] transition-all duration-300"
              />
            ) : (
              <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-[#2a2a2a] flex items-center justify-center shadow-xl border-4 border-[#EEEEEE]/50">
                <span className="text-4xl">🤖</span>
              </div>
            )}
            
            {/* Mic Status Badge */}
            <div 
              className={`absolute -bottom-2 -right-2 rounded-full p-2 shadow-md transition-all duration-300 flex items-center justify-center ${
                listening ? 'bg-green-500/90' : 'bg-red-500/90'
              } ${isProcessing ? 'animate-pulse' : ''}`}
              onClick={toggleListening}
              title={listening ? "Listening - Click to mute" : "Muted - Click to listen"}
            >
              {isProcessing ? (
                <Loader2 className="w-4 h-4 text-white animate-spin" />
              ) : listening ? (
                <Mic className="w-4 h-4 text-white" />
              ) : (
                <MicOff className="w-4 h-4 text-white" />
              )}
            </div>
          </div>

          {/* Greeting */}
          <div className="text-center mt-6">
            <h1 className="text-2xl sm:text-3xl font-bold">
              Hello, I'm <span className="text-[#D4BEE4]">{virtualAssistantName}</span> 👋
            </h1>
            <p className="mt-2 text-[#EEEEEE] text-sm sm:text-base">
              How can I help you today, {userName}?
            </p>
          </div>

          {/* Wake Word Hint */}
          <div className="mt-4 bg-[#2a2a2a]/50 backdrop-blur-sm px-4 py-2 rounded-lg border border-[#3a3a3a]">
            <p className="text-sm text-center text-[#f096db]">
              First Your Query then Say: <span className="font-medium italic">"Hey {virtualAssistantName} or {virtualAssistantName}"</span> to activate
            </p>
          </div>

          {/* Status Indicator */}
          <div className="mt-4 flex items-center justify-center gap-2">
            <div className={`h-3 w-3 rounded-full ${
              listening ? 'bg-green-400' : 'bg-gray-500'
            } ${isProcessing ? 'animate-pulse' : ''}`}></div>
            <span className="text-xs text-gray-300">
              {isProcessing ? 'Processing...' : listening ? 'Listening...' : 'Not Listening'}
            </span>
          </div>
        </div>

        {/* Response Section */}
        <div className="w-full max-w-3xl mt-8 mb-16 px-4">
          {geminiResponse && (
            <div className="bg-[#1e1e1e]/90 backdrop-blur-sm border border-[#333]/50 rounded-xl shadow-lg overflow-hidden transition-all duration-300">
              <div className="bg-[#2a2a2a] px-4 py-3 border-b border-[#333]/50 flex items-center">
                <div className="h-2 w-2 rounded-full bg-[#9B7EBD] mr-2"></div>
                <h4 className="font-medium text-[#D4BEE4]">Assistant Response</h4>
              </div>
              <div className="p-4">
                <p className="text-sm whitespace-pre-wrap leading-relaxed">
                  {geminiResponse}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Current Transcript (for debugging) */}
        {transcript && (
          <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-xs p-2 rounded-lg max-w-xs truncate text-center">
            Heard: "{transcript}"
          </div>
        )}
      </main>
    </div>
  );
};

export default DashBoard;