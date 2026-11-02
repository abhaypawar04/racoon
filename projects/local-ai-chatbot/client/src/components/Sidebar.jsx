import { Plus, MessageSquare, Bot } from "lucide-react";

function Sidebar({ chats, activeChat, onNewChat, onSelectChat }) {
  return (
    <aside className="w-72 bg-[#171717] text-white h-screen p-4 flex flex-col">
      <div className="flex items-center gap-3 mb-8">
        <Bot size={28} />
        <h2 className="text-xl font-semibold">Local AI</h2>
      </div>

      <button
        onClick={onNewChat}
        className="flex items-center gap-3 p-3 rounded-xl border border-gray-600 hover:bg-gray-700"
      >
        <Plus size={20} />
        New Chat
      </button>

      <p className="text-gray-400 text-sm mt-8 mb-3">Recent Conversations</p>

      <div className="flex-1 overflow-y-auto space-y-2">
        {chats.map((chat) => (
          <button
            key={chat._id}
            onClick={() => onSelectChat(chat._id)}
            className={`w-full flex items-center gap-3 p-3 rounded-lg text-left text-sm truncate ${
              activeChat === chat._id ? "bg-gray-700" : "hover:bg-gray-800"
            }`}
          >
            <MessageSquare size={17} />
            <span className="truncate">{chat.title}</span>
          </button>
        ))}
      </div>

      <div className="text-xs text-gray-500 pt-4 border-t border-gray-700">
        Powered by Ollama · Llama 3.1
      </div>
    </aside>
  );
}

export default Sidebar;
