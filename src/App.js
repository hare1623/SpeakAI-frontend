import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { FaVolumeUp, FaMicrophone } from 'react-icons/fa';
import './App.css';

function App() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('Hello! How can I assist you today?');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const handleSearch = useCallback(async () => {
    if (!query) return;
    try {
      const res = await axios.post('https://speakai-backend.vercel.app/api/search', { query });
      setResponse(res.data.answer);
    } catch (err) {
      console.error(err);
    }
  }, [query]);

  useEffect(() => {
    if (query) {
      handleSearch();
    }
  }, [query, handleSearch]);

  const handleSpeak = () => {
    if ('speechSynthesis' in window) {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
      const utterance = new SpeechSynthesisUtterance(response);
      setIsSpeaking(true);
      utterance.onend = () => {
        setIsSpeaking(false);
      };
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Speech synthesis not supported in this browser.');
    }
  };

  const handleVoiceSearch = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
      };

      recognition.onerror = (event) => {
        setIsListening(false);
        console.error('Speech recognition error:', event.error);
      };

      recognition.start();
    } else {
      alert('Speech recognition not supported in this browser.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-6 md:p-10 rounded-lg shadow-lg max-w-full md:max-w-lg w-full text-center">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">SpeakAI: Your Personal AI Speaker</h1>

        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 mb-6 w-full">
          <input
            type="text"
            className="flex-grow p-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm w-full"
            placeholder="Ask your question..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="flex space-x-2 w-full md:w-auto">
            <button
              onClick={handleSearch}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 md:px-6 rounded-full transition duration-300 shadow-lg focus:outline-none w-full md:w-auto"
            >
              Search
            </button>
            <button
  onClick={handleVoiceSearch}
  className={`bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-4 rounded-full transition duration-300 shadow-lg focus:outline-none w-full md:w-auto flex justify-center items-center ${isListening ? 'opacity-50' : ''}`}
  disabled={isListening}
>
  <FaMicrophone className="text-lg" />
</button>
          </div>
        </div>

        {/* Display the response */}
        <div className="bg-gray-50 p-6 rounded-lg shadow-inner text-left w-full">
          <p className="text-lg mb-4">{response}</p>
          <button
            onClick={handleSpeak}
            disabled={isSpeaking}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-full inline-flex items-center space-x-2 transition duration-300 shadow-lg focus:outline-none"
          >
            <FaVolumeUp />
            <span>{isSpeaking ? 'Speaking...' : 'Speak'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
