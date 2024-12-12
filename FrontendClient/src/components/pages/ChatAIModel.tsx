import { MessageCircle, Send, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import VoiceSearchInput from "./VoiceSearchInput";
import '../common/styles/global.css'

const BASE_URL = import.meta.env.VITE_API_URL_CHATBOT;

interface Message {
  role: "user" | "assistant";
  content: string;
  isTyping?: boolean;
  fullContent?: string;
}

interface ChatAIModalProps {
  isOpen: boolean;
  onClose: () => void;
  chatRef: React.RefObject<HTMLDivElement>;
  className?: string;
}

export default function ChatAIModal({
  isOpen,
  onClose,
  chatRef,
  className,
}: ChatAIModalProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleStreamResponse = async (
    reader: ReadableStreamDefaultReader<Uint8Array>
  ) => {
    let fullResponse = ''; // Track complete response

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        setMessages((prev) => {
          const newMessages = [...prev];
          const lastMessage = newMessages[newMessages.length - 1];
          lastMessage.isTyping = false;
          lastMessage.content = fullResponse; // Set final complete content
          lastMessage.fullContent = fullResponse;
          return newMessages;
        });
        break;
      }

      const text = new TextDecoder().decode(value);
      const cleanedText = text.replace(/^"|"$/g, "");
      fullResponse += cleanedText; // Append to complete response

      setMessages((prev) => {
        const newMessages = [...prev];
        const lastMessage = newMessages[newMessages.length - 1];
        lastMessage.content = fullResponse; // Update with complete response so far
        lastMessage.fullContent = fullResponse;
        return newMessages;
      });
    }
  };

  const sendMessage = async (messageText: string) => {
    try {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "",
          fullContent: "",
          isTyping: true,
        } as Message,
      ]);

      const response = await fetch(`${BASE_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: messageText }),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const reader = response.body?.getReader();
      if (reader) {
        await handleStreamResponse(reader);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => {
        const newMessages = [...prev];
        const lastMessage = newMessages[newMessages.length - 1];
        lastMessage.content =
          "Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.";
        lastMessage.isTyping = false;
        return newMessages;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    await sendMessage(input);
  };

  const handleVoiceInput = async (voiceText: string) => {
    const userMessage: Message = { role: "user", content: voiceText };
    setMessages((prev) => [...prev, userMessage]);
    await sendMessage(voiceText);
  };

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.role === "assistant" && lastMessage.fullContent) {
      const fullContent = lastMessage.fullContent;
      const currentContent = lastMessage.content;

      if (currentContent.length < fullContent.length) {
        const timeout = setTimeout(() => {
          setMessages((prev) => {
            const newMessages = [...prev];
            const lastMsg = newMessages[newMessages.length - 1];
            lastMsg.content = fullContent.slice(0, currentContent.length + 1);
            return [...newMessages];
          });
        }, 10);

        return () => clearTimeout(timeout);
      }
    }
  }, [messages]);

  if (!isOpen) return null;

  return (
    <div
      ref={chatRef}
      className={`fixed bottom-8 right-4 w-[90%] md:w-96 h-[500px] md:h-[700px] bg-white rounded-lg shadow-lg flex flex-col border border-gray-300 ${className} z-[9999]`}
      style={{ maxHeight: "80vh", overflow: "hidden" }}
    >
      {/* Header */}
      <div className="flex gap-2 items-center px-4 py-2  border-b border-gray-300 bg-green-500">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-white" />
        </div>

        <h3 className="font-semibold text-lg text-white">Dịch Vụ Hưng Ngân</h3>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-2 hover:bg-green-700 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
      <div className="text-center mb-6">
        <div className="flex justify-center mb-2">
          <img
            src="/img/iconAI.png"
            alt="Logo"
            className="w-16 h-16 rounded-full shadow-md"
          />
        </div>
        <h2 className="text-xl font-bold text-gray-800">Dịch Vụ Hưng Ngân</h2>
        <p className="text-sm text-gray-500 mt-1">
          Khám phá ngay những dịch vụ tiện ích xung quanh Chung cư Hưng Ngân.
        </p>
      </div>

        {/* Phần tin nhắn */}
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-4 ${message.role === "user" ? "text-right" : "text-left"}`}
          >
            <div
              className={`inline-block px-4 py-2 rounded-lg shadow-md ${
                message.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-800"
              }`}
              dangerouslySetInnerHTML={{
                __html: message.content
                  .replace(/;/g, "<br />")
                  .replace(/(?<=\d\.)\s/g, "<br />")
                  .replace(/:/, ":<br />")
                  + (message.isTyping ? '<span class="typing-indicator"><span>.</span><span>.</span><span>.</span></span>' : '')
              }}
            />
          </div>
        ))}
        <div ref={messagesEndRef} />
</div>

      {/* Input Form */}
      <form
        onSubmit={handleSubmit}
        className="p-4 border-t border-gray-300"
      >
        <div className="relative flex gap-2 items-center">
          <VoiceSearchInput
            value={input}
            onChange={(e) => {
              if ("target" in e) {
                if (e.target.value.startsWith("recording.m4a:")) {
                  const voiceText = e.target.value.replace(
                    "recording.m4a:",
                    ""
                  );
                  handleVoiceInput(voiceText);
                } else {
                  setInput(e.target.value);
                }
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            className="flex-1 px-3 py-2 border rounded-lg"
            placeholder="Nhập tin nhắn..."
            isChat={true}
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className={`p-2 rounded-full flex items-center justify-center ${
              input.trim()
                ? "bg-green-500 hover:bg-green-600 text-white"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
}
