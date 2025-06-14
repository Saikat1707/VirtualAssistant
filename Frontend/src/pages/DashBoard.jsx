import React, { useEffect, useState } from 'react';
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
  const [geminiResponse, setGeminiResponse] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { transcript, resetTranscript, listening, browserSupportsSpeechRecognition } = useSpeechRecognition();

  const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetch = async () => {
    try {
      await fetchUser();
    } catch (err) {
        console.error("Error fetching user:", err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  // Redirect only after loading is complete
  useEffect(() => {
    if (!loading && isLogin === false) {
      navigate('/auth/login');
    }
  }, [loading, isLogin, navigate]);

  if (loading) {
    return <div className="text-white">Loading...</div>; // or a spinner
  }

  // Your component JSX here

  // Start voice recognition if supported
  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      toast.error("Your browser does not support speech recognition.");
      return;
    }

    const startListening = async () => {
      try {
        await SpeechRecognition.startListening({
          continuous: true,
          language: 'en-IN',
        });
      } catch (error) {
        console.error("Speech start error:", error);
        toast.error("Failed to start voice recognition");
      }
    };

    startListening();

    return () => {
      SpeechRecognition.stopListening();
    };
  }, [browserSupportsSpeechRecognition]);

  // Detect wake words and process query
  useEffect(() => {
    if (!transcript || !user?.virtualAssistantName || isProcessing) return;

    const wakeWords = [`hey ${user.virtualAssistantName.toLowerCase()}`, `${user.virtualAssistantName.toLowerCase()}`];

    const saidWakeWord = wakeWords.some(word => transcript.toLowerCase().includes(word));
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
      const { response, actionUrl } = await geminiQuery(query);
      speak(response);
      setGeminiResponse(response);
      if (actionUrl) window.open(actionUrl);
      await fetchUser();
    } catch (error) {
      console.error("Gemini error:", error);
      speak("Sorry, I encountered an error. Please try again.");
      toast.error(error.message || "Something went wrong");
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
      console.error("Logout error:", err);
      toast.error("Failed to log out");
    }
  };

  const handleCustomize = () => navigate('/customization/dummy');

  const toggleListening = async () => {
    try {
      if (listening) {
        await SpeechRecognition.stopListening();
        toast.info("Microphone muted");
      } else {
        await SpeechRecognition.startListening({ continuous: true, language: 'en-IN' });
        resetTranscript();
        toast.info("Microphone active");
      }
    } catch (error) {
      console.error("Toggle mic error:", error);
      toast.error("Failed to toggle microphone");
    }
  };

  const handleReset = () => resetTranscript();

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
      {/* Menu button for mobile */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-[#2a2a2a]/90 p-2 rounded-md shadow-lg backdrop-blur-sm"
        onClick={() => setShowHistory(prev => !prev)}
        aria-label="Toggle history"
      >
        <Menu className="text-white w-6 h-6" />
      </button>

      {/* Sidebar */}
      <aside className={`bg-[#1f1f1f]/95 md:bg-[#1f1f1f] text-white p-6 transition-all duration-300 z-40 
        ${showHistory ? 'fixed inset-0 w-full h-screen' : 'hidden'} md:block md:static md:w-1/4 md:h-screen`}
      >
        <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-2">
          <h2 className="text-xl font-bold">Search History</h2>
          {showHistory && (
            <button onClick={() => setShowHistory(false)} className="md:hidden text-gray-400 hover:text-white">
              ✕
            </button>
          )}
        </div>
        <div className="h-[calc(100%-50px)] overflow-y-auto scrollbar-thin scrollbar-thumb-[#9B7EBD] scrollbar-track-[#2a2a2a] pr-2">
          {searchHistory && searchHistory.length > 0 ? (
            <ul className="space-y-2">
              {[...searchHistory].reverse().map((item, index) => (
                <li
                  key={index}
                  className="bg-[#2a2a2a]/60 hover:bg-[#3a3a3a]/80 rounded-lg p-3 cursor-pointer"
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
      <main className="w-full md:w-3/4 flex flex-col items-center justify-start p-4 md:p-8 relative min-h-screen">
        <div className="absolute top-4 right-4 flex flex-col md:flex-row items-end gap-3 z-30">
          <button onClick={handleReset} className="bg-[#121114] hover:bg-[#403f41] text-white py-2 px-4 rounded-xl text-sm md:text-base">
            Reset Command
          </button>
          <button onClick={handleCustomize} className="bg-[#9B7EBD] hover:bg-[#bca3d6] text-white py-2 px-4 rounded-xl text-sm md:text-base">
            Customize
          </button>
          <button onClick={handleLogOut} className="bg-[#D93636]/90 hover:bg-[#f75e5e] text-white py-2 px-4 rounded-xl text-sm md:text-base">
            Logout
          </button>
        </div>

        <div className="w-full max-w-3xl flex flex-col items-center mt-16 md:mt-24 px-4">
          <div className="relative group">
            {virtualAssistantImage ? (
              <img
                src={virtualAssistantImage}
                alt="Assistant"
                className="w-28 h-28 sm:w-36 sm:h-36 rounded-full object-cover shadow-xl border-4 border-[#EEEEEE]/50 group-hover:border-[#D4BEE4]"
              />
            ) : (
              <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-[#2a2a2a] flex items-center justify-center shadow-xl border-4 border-[#EEEEEE]/50">
                <span className="text-4xl">🤖</span>
              </div>
            )}
            <div
              className={`absolute -bottom-2 -right-2 rounded-full p-2 shadow-md ${
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

          <div className="text-center mt-6">
            <h1 className="text-2xl sm:text-3xl font-bold">
              Hello, I'm <span className="text-[#D4BEE4]">{virtualAssistantName}</span> 👋
            </h1>
            <p className="mt-2 text-[#EEEEEE] text-sm sm:text-base">
              How can I help you today, {userName}?
            </p>
          </div>

          <div className="mt-4 bg-[#2a2a2a]/50 px-4 py-2 rounded-lg border border-[#3a3a3a]">
            <p className="text-sm text-[#f096db] text-center">
              First your query, then say <span className="italic">"Hey {virtualAssistantName}"</span> to activate
            </p>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <div className={`h-3 w-3 rounded-full ${listening ? 'bg-green-400' : 'bg-gray-500'} ${isProcessing ? 'animate-pulse' : ''}`}></div>
            <span className="text-xs text-gray-300">
              {isProcessing ? 'Processing...' : listening ? 'Listening...' : 'Not Listening'}
            </span>
          </div>
        </div>

        {geminiResponse && (
          <div className="w-full max-w-3xl mt-8 mb-16 px-4">
            <div className="bg-[#1e1e1e]/90 border border-[#333]/50 rounded-xl shadow-lg">
              <div className="bg-[#2a2a2a] px-4 py-3 border-b border-[#333]/50 flex items-center">
                <div className="h-2 w-2 rounded-full bg-[#9B7EBD] mr-2"></div>
                <h4 className="text-[#D4BEE4] font-medium">Assistant Response</h4>
              </div>
              <div className="p-4 text-sm whitespace-pre-wrap leading-relaxed">
                {geminiResponse}
              </div>
            </div>
          </div>
        )}

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
