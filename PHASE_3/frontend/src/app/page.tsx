"use client";

import { useState, FormEvent, useEffect, useRef } from "react";
import { sendMessage, ChatResponse } from "./chatService";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function Home() {
  const [userId] = useState("default_user"); // Replace with actual user from auth
  const [token] = useState("your_dummy_auth_token"); // Replace with actual token from auth
  const [conversationId, setConversationId] = useState<number | undefined>(undefined);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to the bottom of the chat container when new messages are added
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const res: ChatResponse = await sendMessage(
        userId,
        input,
        conversationId,
        token
      );
      
      const assistantMessage: Message = { role: "assistant", content: res.response };
      setMessages((prev) => [...prev, assistantMessage]);
      setConversationId(res.conversation_id);

    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: Message = { role: "assistant", content: "Sorry, something went wrong." };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div className="w-full max-w-2xl h-[85vh] flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <header className="bg-gray-800 text-white p-4 rounded-t-lg">
          <h1 className="text-2xl font-bold text-center">AI Todo Chatbot (Free Model)</h1>
        </header>

        <main 
          ref={chatContainerRef}
          className="flex-1 p-6 space-y-4 overflow-y-auto"
        >
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-lg shadow ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white"
                }`}
              >
                <p style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-lg shadow bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white">
                <p>Thinking...</p>
              </div>
            </div>
          )}
        </main>

        <footer className="p-4 border-t border-gray-200 dark:border-gray-700">
          <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
              disabled={isLoading}
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
              disabled={isLoading}
            >
              Send
            </button>
          </form>
        </footer>
      </div>
    </div>
  );
}
