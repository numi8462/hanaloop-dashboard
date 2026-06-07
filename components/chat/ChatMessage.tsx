interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
}

export default function ChatMessage({ role, content }: ChatMessageProps) {
  const isUser = role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed break-words whitespace-pre-wrap ${
          isUser
            ? "bg-[#533afd] text-white rounded-br-sm"
            : "bg-[#f6f9fc] border border-[#e3e8ee] text-[#1e293b] rounded-bl-sm"
        }`}
      >
        {content}
      </div>
    </div>
  );
}
