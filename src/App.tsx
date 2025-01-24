import { useEffect, useRef, useState } from "react";
import ChatForm from "./components/ChatForm";
import Icon from "./components/Icon";
import ChatMessage from "./components/ChatMessage";

interface ChatMessageType {
  role: string;
  text: string;
  isError?: boolean;
}

const App: React.FC = () => {
  const [chatHistory, setChatHistory] = useState<ChatMessageType[]>([]);
  const chatBodyRef = useRef<HTMLDivElement>(null);
  const isFetching = useRef(false); // Prevent multiple simultaneous API calls

  const generateBotResponse = async (history: ChatMessageType[]) => {
    if (isFetching.current) return; // Avoid duplicate API calls
    isFetching.current = true;

    const updateHistory = (text: string, isError = false) => {
      setChatHistory((prev) => [
        ...prev.filter((msg) => msg.text !== "Thinking..."),
        { role: "model", text, isError },
      ]);
    };

    const formattedHistory = history.map(({ role, text }) => ({
      role,
      parts: [{ text }],
    }));

    const requestOptions: RequestInit = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: formattedHistory }),
    };

    try {
      const response = await fetch(import.meta.env.VITE_API_URL, requestOptions);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error.message || "Something went wrong!");

      const apiResponseText = data.candidates[0].content.parts[0].text
        .replace(/\*\*(.*?)\*\*/g, "$1")
        .trim();

      updateHistory(apiResponseText);
    } catch (error: any) {
      updateHistory(error.message || "An error occurred!", true);
    } finally {
      isFetching.current = false;
    }
  };

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTo({
        top: chatBodyRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [chatHistory]);

  return (
    <div className="container">
      <header className="chat-header">
        <div className="header-info">
          <Icon />
          <h2 className="logo-text">AURA</h2>
        </div>
      </header>

      <div ref={chatBodyRef} className="chat-body">
        <div className="message bot-message">
          <Icon />
          <p className="message-text">
            Hello, My name is AURA (Adaptive User Resource Aid)! How can I help you?
          </p>
        </div>
        {chatHistory.map((chat, index) => (
          <ChatMessage key={index} chat={chat} />
        ))}
      </div>

      <footer className="chat-footer">
        <ChatForm
          chatHistory={chatHistory}
          setChatHistory={setChatHistory}
          generateBotResponse={generateBotResponse}
        />
      </footer>
    </div>
  );
};

export default App;