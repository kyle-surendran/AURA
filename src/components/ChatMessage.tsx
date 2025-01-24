import Icon from "./Icon";

interface ChatMessageProps {
  chat: {
    role: string;
    text: string;
    isError?: boolean;
  };
}

const ChatMessage: React.FC<ChatMessageProps> = ({ chat }) => {
  return (
    <div
      className={`message ${chat.role === "model" ? "bot" : "user"}-message ${
        chat.isError ? "error" : ""
      }`}
    >
      {chat.role === "model" && <Icon />}
      <p className="message-text">{chat.text}</p>
    </div>
  );
};

export default ChatMessage;
