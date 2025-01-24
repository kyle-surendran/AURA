import { useRef, FormEvent } from "react";

interface ChatHistoryEntry {
  role: string;
  text: string;
}

interface ChatFormProps {
  chatHistory: ChatHistoryEntry[];
  setChatHistory: React.Dispatch<React.SetStateAction<ChatHistoryEntry[]>>;
  generateBotResponse: (updatedHistory: ChatHistoryEntry[]) => void;
}

const ChatForm: React.FC<ChatFormProps> = ({ chatHistory, setChatHistory, generateBotResponse }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    const userMessage = inputRef.current?.value.trim();
    if (!userMessage) return;

    if (inputRef.current) {
      inputRef.current.value = "";
    }

    setChatHistory((prevHistory) => {
      const updatedHistory = [...prevHistory, { role: "user", text: userMessage }];

      setTimeout(() => {
        const botThinkingHistory = [...updatedHistory, { role: "model", text: "Hmmmm..." }];
        setChatHistory(botThinkingHistory);

        generateBotResponse(botThinkingHistory);
      }, 600);
      return updatedHistory; 
    });
  };

  return (
    <form action="#" className="chat-form" onSubmit={handleFormSubmit}>
      <input ref={inputRef} type="text" placeholder="Your message..." className="message-input" required />
      <button className="material-symbols-outlined">send</button>
    </form>
  );
};

export default ChatForm;