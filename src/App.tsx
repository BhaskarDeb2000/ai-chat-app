import { useState, useRef, useEffect } from "react";
import {
  FiMessageSquare,
  FiSettings,
  FiUser,
  FiSend,
  FiSun,
  FiMoon,
} from "react-icons/fi";
import ReactMarkdown from "react-markdown";
import clsx from "clsx";
import { Message, APIErrorResponse } from "./type";

import { apiKey, apiUrl, defaultModel } from "./config";

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const toggleTheme = () => setDarkMode((prev) => !prev);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Function to handle errors
  const handleError = (error: unknown): string => {
    if (error instanceof Error) return error.message;
    if (typeof error === "string") return error;

    try {
      const errorObj = error as APIErrorResponse;
      return (
        errorObj.error?.message ||
        errorObj.message ||
        "An unknown error occurred."
      );
    } catch {
      return "An unknown error occurred.";
    }
  };

  // Function to send messages
  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    if (defaultModel.id === "Pro/deepseek-ai/DeepSeek-R1") {
      setMessages((prev) => [
        ...prev,
        {
          role: "thinking",
          content: "",
          thinking: [],
          isStreaming: true,
          showThinking: true,
        },
      ]);
    }

    try {
      const response = await fetch(`${apiUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: defaultModel.id,
          messages: [...messages, userMessage].map((msg) => ({
            role:
              msg.role === "error" || msg.role === "thinking"
                ? "assistant"
                : msg.role,
            content: msg.content,
          })),
          stream: true,
        }),
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("Failed to read response");

      let assistantMessage: Message = {
        role: "assistant",
        content: "",
        isStreaming: true,
      };
      setMessages((prev) => [...prev, assistantMessage]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = new TextDecoder().decode(value);
        const lines = chunk
          .split("\n")
          .map((line) => line.trim())
          .filter((line) => line);

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const jsonData = line.slice(5).trim();
            if (jsonData === "[DONE]") continue;

            const data = JSON.parse(jsonData);
            if (data.choices?.[0]?.delta?.content) {
              const content = data.choices[0].delta.content;
              assistantMessage.content += content;

              setMessages((prev) =>
                prev.map((msg, i) =>
                  i === prev.length - 1 ? { ...assistantMessage } : msg
                )
              );
            }
          }
        }
      }

      assistantMessage.isStreaming = false;
      setMessages((prev) =>
        prev.map((msg, i) =>
          i === prev.length - 1 ? { ...assistantMessage } : msg
        )
      );
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "error", content: handleError(error) },
      ]);
      console.error("API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={clsx(
        "flex h-screen",
        darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
      )}
    >
      <div
        className={clsx(
          "w-64 p-4 flex flex-col",
          darkMode ? "bg-gray-800" : "bg-gray-200"
        )}
      >
        <button
          onClick={() => setMessages([])}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg mb-4"
        >
          <FiMessageSquare /> Start New Chat
        </button>
        <div className="mt-auto">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-700 rounded-lg"
          >
            <FiSettings /> Settings
          </button>
        </div>
        {showSettings && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div
              className={clsx(
                "p-6 rounded-lg w-80",
                darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
              )}
            >
              <h2 className="text-xl font-bold mb-4">Settings</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Dark Mode</span>
                  <button
                    onClick={toggleTheme}
                    className={clsx(
                      "p-2 rounded-full",
                      darkMode ? "bg-gray-700" : "bg-gray-300"
                    )}
                  >
                    {darkMode ? <FiSun /> : <FiMoon />}
                  </button>
                </div>
                <button
                  onClick={() => setShowSettings(false)}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto p-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={clsx(
                "mb-4 flex",
                message.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={clsx(
                  "max-w-3xl rounded-lg p-4",
                  message.role === "user"
                    ? "bg-blue-600"
                    : message.role === "error"
                    ? "bg-red-600"
                    : "bg-gray-700"
                )}
              >
                <div className="flex items-center gap-2 mb-2">
                  {message.role === "user" ? <FiUser /> : <FiMessageSquare />}
                  <span className="font-medium">
                    {message.role === "user" ? "You" : "AI"}
                  </span>
                </div>
                <ReactMarkdown className="prose prose-invert">
                  {message.content}
                </ReactMarkdown>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="border-t border-gray-700 p-4">
          <div className="flex gap-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyUp={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type your message..."
              className="flex-1 bg-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSend}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <FiSend />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
