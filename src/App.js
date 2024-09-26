import { useState } from 'react';
import axios from 'axios';
import { FaVolumeUp } from 'react-icons/fa';
import './App.css'; 
function App() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleSearch = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/search', {
        query,
      });
      setResponse(res.data.answer);
    } catch (err) {
      console.error(err);
    }
  };

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

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-10 rounded-lg shadow-lg max-w-lg w-full text-center">
        <h1 className="text-3xl font-bold mb-6">GPT Search with Text-to-Speech</h1>

        <div className="flex items-center space-x-4 mb-6">
          <input
            type="text"
            className="flex-grow p-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ask your question..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            onClick={handleSearch}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-full transition duration-300"
          >
            Search
          </button>
        </div>

        {response && (
          <div className="bg-gray-50 p-6 rounded-lg shadow-inner text-left">
            <p className="text-lg mb-4">{response}</p>

            <button
              onClick={handleSpeak}
              disabled={isSpeaking}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-full inline-flex items-center space-x-2 transition duration-300"
            >
              <FaVolumeUp />
              <span>{isSpeaking ? 'Speaking...' : 'Speak'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
