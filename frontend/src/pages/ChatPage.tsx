import { useEffect, useRef } from "react";
import { useAuth } from "../features/auth/AuthContext";
import { useChat } from "../hooks/useChat";
import { ChatMessage } from "../components/chat/ChatMessage";
import { ChatInput } from "../components/chat/ChatInput";
import { TypingIndicator } from "../components/chat/TypingIndicator";
import { SectionCard } from "../components/ui/SectionCard";

function getAccessToken(): string | null {
  try {
    return localStorage.getItem("accessToken");
  } catch {
    return null;
  }
}

export function ChatPage() {
  const { user } = useAuth();
  const token = getAccessToken();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const roomId = "general";

  const {
    messages,
    typingUsers,
    isConnected,
    sendMessage,
    onInputChange,
    onInputBlur,
    onInputSubmit,
  } = useChat({ roomId, token, username: user?.username });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingUsers]);

  return (
    <div className="pb-12 max-w-3xl mx-auto">
      <section className="dark-card-depth rounded-[24px] border border-outline bg-surface-high/80 p-6 shadow-card backdrop-blur-xl dark:text-[#f0ebe2] flex flex-col h-[calc(100vh-10rem)] min-h-0">
        <p className="font-mono text-[11px] font-medium uppercase tracking-[0.24em] text-muted dark:text-[#d7cec0]">
          Real-time Chat
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-[-0.02em] text-text dark:text-[#fff8ef]">
          Community Chat
        </h2>
        <div className="flex-1 flex flex-col min-h-0 mt-4">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-black/10 dark:border-[#3a3a45]/30">
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                isConnected ? "bg-green-500" : "bg-red-500"
              }`}
            />
            <span className="text-xs font-bold text-muted dark:text-[#a0a0ab]">
              {isConnected ? "Connected" : "Disconnected"}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto min-h-0 space-y-3 px-1 mb-2">
            {messages.length === 0 && (
              <p className="text-center text-sm text-muted py-8">
                No messages yet. Start the conversation!
              </p>
            )}
            {messages.map((msg) => (
              <ChatMessage
                key={msg.id}
                message={msg.message}
                username={msg.username}
                isOwn={msg.user_id === user?.id}
                timestamp={msg.timestamp}
              />
            ))}

            <div ref={messagesEndRef} />
          </div>

          <TypingIndicator users={typingUsers} className="px-1 pb-1" />

          <ChatInput
            onSendMessage={sendMessage}
            onInputChange={onInputChange}
            onInputBlur={onInputBlur}
            onInputSubmit={onInputSubmit}
            disabled={!isConnected}
          />
        </div>
      </section>
    </div>
  );
}

export default ChatPage;
