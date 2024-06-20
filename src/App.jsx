import { useState } from "react";
import "./App.css";
import axios from "axios";
import ReactMarkdown from "react-markdown";

function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [generatingAnswer, setGeneratingAnswer] = useState(false);
  const [history, setHistory] = useState([]); // Stores past prompts and answers

  async function generateAnswer(e) {
    setGeneratingAnswer(true);
    e.preventDefault();
    setAnswer("Loading your answer...");
    try {
      const response = await axios({
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${
          import.meta.env.VITE_API_GENERATIVE_LANGUAGE_CLIENT
        }`,
        method: "post",
        data: {
          contents: [{ parts: [{ text: question }] }],
        },
      });

      const generatedAnswer = response.data.candidates[0].content.parts[0].text;
      setAnswer(generatedAnswer);
      setHistory([...history, { question, answer: generatedAnswer }]); // Store prompt and answer together
    } catch (error) {
      console.log(error);
      setAnswer("Sorry - Something went wrong. Please try again!");
    }

    setGeneratingAnswer(false);
  }

  return (
    <>
      <div className="flex flex-col min-h-screen bg-gray-900 text-white">
        <header className="flex items-center justify-center py-4 bg-gray-800 shadow-md">
          <a
            href=""
            target="_blank"
            className="text-2xl font-semibold text-white"
          >
            Chat AI
          </a>
        </header>
        <main className="flex flex-col items-center justify-center py-8 px-4 space-y-8">
          <form onSubmit={generateAnswer} className="w-full max-w-2xl">
            <textarea
              required
              className="w-full rounded-md border border-gray-600 bg-gray-800 p-3 focus:border-blue-500 focus:outline-none text-base text-white"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask anything..."
            ></textarea>
            <button
              type="submit"
              className="mt-4 block w-full rounded-md bg-blue-600 py-2 px-4 text-center text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={generatingAnswer}
            >
              {generatingAnswer ? "Loading..." : "Generate Answer"}
            </button>
          </form>

          <div className="w-full max-w-2xl rounded-md bg-gray-800 p-4 shadow-md overflow-auto">
            {history.length > 0 && (
              <h2 className="text-lg font-medium text-gray-300 mb-4">
                Previous Conversations
              </h2>
            )}
            {history.map((item, index) => (
              <div
                key={index}
                className="flex flex-col mb-4 border-b border-gray-700 pb-4"
              >
                <p className="text-base font-medium text-gray-400">
                  Prompt: {item.question}
                </p>
                <ReactMarkdown className="mt-2 text-base text-gray-300">
                  {item.answer}
                </ReactMarkdown>
              </div>
            ))}
            {answer && (
              <div className="flex flex-col mb-4 border-b border-gray-700 pb-4">
                <p className="text-base font-medium text-gray-400">
                  Prompt: {question}
                </p>
                <ReactMarkdown className="mt-2 text-base text-gray-300">
                  {answer}
                </ReactMarkdown>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}

export default App;
