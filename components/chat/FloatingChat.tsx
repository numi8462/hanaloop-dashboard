"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import ChatMessage from "./ChatMessage";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const INITIAL_MESSAGE: Message = {
  role: "assistant",
  content:
    "안녕하세요! 저는 HanaLoop PCF 어시스턴트입니다. 탄소 배출량 데이터에 대해 무엇이든 물어보세요.",
};

const SUGGESTED_QUESTIONS = [
  "가장 많이 배출하는 카테고리가 뭐야?",
  "탄소 비용이 얼마야?",
  "배출량을 줄이려면 어떻게 해야 해?",
  "이 추세면 목표 달성 가능해?",
];

export default function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleClose() {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 200);
  }

  function handleReset() {
    setMessages([INITIAL_MESSAGE]);
    setInput("");
  }

  async function handleSend(content: string) {
    if (!content.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error);

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: json.message },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "죄송합니다. 답변을 생성하지 못했습니다. 다시 시도해주세요.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      {/* 채팅창 */}
      {(isOpen || isClosing) && (
        <div
          className={`${isClosing ? "animate-chat-out" : "animate-chat-in"} fixed bottom-20 right-4 lg:right-6 z-50 w-85 lg:w-95 flex flex-col rounded-2xl border border-[#e3e8ee] bg-white overflow-hidden`}
          style={{
            boxShadow:
              "rgba(0,55,112,0.08) 0 8px 24px, rgba(0,55,112,0.04) 0 2px 6px",
            maxHeight: "520px",
          }}
        >
          {/* 헤더 */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#533afd] shrink-0">
            <div className="flex items-center gap-2">
              <MessageSquare size={16} className="text-white" />
              <span className="text-sm font-semibold text-white">
                AI 어시스턴트
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleReset}
                className="text-white/60 hover:text-white transition-colors"
                title="대화 초기화"
              >
                <RotateCcw size={14} />
              </button>
              <button
                onClick={handleClose}
                className="text-white/60 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* 메시지 영역 */}
          <div className="flex-1 overflow-y-auto flex flex-col gap-3 p-4 min-h-0">
            {messages.map((m, i) => (
              <ChatMessage key={i} role={m.role} content={m.content} />
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-[#f6f9fc] border border-[#e3e8ee] px-4 py-2.5 rounded-2xl rounded-bl-sm">
                  <div className="flex gap-1 items-center h-4">
                    <span
                      className="w-1.5 h-1.5 bg-[#94a3b8] rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <span
                      className="w-1.5 h-1.5 bg-[#94a3b8] rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <span
                      className="w-1.5 h-1.5 bg-[#94a3b8] rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* 추천 질문 */}
          <div className="px-4 pb-3 flex flex-wrap gap-1.5 shrink-0">
            {SUGGESTED_QUESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => handleSend(q)}
                disabled={isLoading}
                className="text-xs px-3 py-1.5 rounded-full border border-[#e3e8ee] text-[#64748d] hover:bg-[#f0efff] hover:border-[#533afd]/20 hover:text-[#533afd] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {q}
              </button>
            ))}
          </div>

          {/* 입력 영역 */}
          <div className="p-3 border-t border-[#e3e8ee] flex gap-2 shrink-0">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend(input)}
              placeholder="질문을 입력하세요..."
              disabled={isLoading}
            />
            <button
              onClick={() => handleSend(input)}
              disabled={!input.trim() || isLoading}
              className="px-3 rounded-full bg-[#533afd] hover:bg-[#4434d4] disabled:bg-[#e3e8ee] disabled:cursor-not-allowed transition-colors shrink-0"
            >
              <Send size={15} className="text-white" />
            </button>
          </div>
        </div>
      )}

      {/* 플로팅 버튼 */}
      <button
        onClick={() => (isOpen ? handleClose() : setIsOpen(true))}
        className="fixed bottom-4 right-4 lg:right-6 z-50 w-12 h-12 rounded-full bg-[#533afd] hover:bg-[#4434d4] flex items-center justify-center transition-colors"
        style={{ boxShadow: "rgba(83,58,253,0.3) 0 4px 14px" }}
      >
        {isOpen || isClosing ? (
          <X size={20} className="text-white" />
        ) : (
          <MessageSquare size={20} className="text-white" />
        )}
      </button>
    </>
  );
}
