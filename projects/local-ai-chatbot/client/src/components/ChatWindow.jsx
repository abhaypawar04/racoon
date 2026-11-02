import { Bot, User } from "lucide-react";

function ChatWindow({ messages, loading }) {
  return (
    <div className="flex-1 overflow-y-auto p-6">
      {messages.length === 0 && (
        <div className="h-full flex flex-col justify-center items-center text-center">
          <Bot size={48} className="mb-4 text-gray-400" />
          <h1 className="text-3xl font-semibold">What can I help you with?</h1>
          <p className="text-gray-500 mt-2">
            Chat with your local AI assistant.
          </p>
        </div>
      )}

      <div className="max-w-3xl mx-auto space-y-6">
        {messages.map((message, index) => (
          <div key={index} className="flex gap-4">
            <div className="mt-1">
              {message.role === "user" ? <User size={22} /> : <Bot size={22} />}
            </div>

            <div className="flex-1 whitespace-pre-wrap leading-7">
              {message.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="text-gray-500 animate-pulse">AI is thinking...</div>
        )}
      </div>
    </div>
  );
}

export default ChatWindow;
