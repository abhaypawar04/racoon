import { useState, useRef, useEffect } from "react";
import axios from "axios";
import {
  Send,
  Bot,
  User,
  Plus,
  MessageSquare,
  PanelLeftClose,
  PanelLeftOpen,
  Sparkles,
  Trash2,
  ArrowUp,
  Cpu,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";

import "./App.css";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenu, setMobileMenu] = useState(false);

  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  const sendMessage = async (text = input) => {
    if (!text.trim() || loading) return;

    const userMessage = {
      role: "user",
      content: text.trim(),
    };

    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/api/chat", {
        messages: updatedMessages,
      });

      const aiMessage = {
        role: "assistant",
        content: response.data.reply,
      };

      setMessages([...updatedMessages, aiMessage]);
    } catch (error) {
      console.error("Chat error:", error);

      setMessages([
        ...updatedMessages,
        {
          role: "assistant",
          content:
            "I'm having trouble connecting to the AI server. Please check your connection and try again.",
          error: true,
        },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const newChat = () => {
    setMessages([]);
    setInput("");
    setMobileMenu(false);
    inputRef.current?.focus();
  };

  const suggestions = [
    {
      title: "Explain something",
      description: "Break down complex topics into simple explanations.",
      prompt: "Explain artificial intelligence in simple terms.",
      icon: Sparkles,
    },
    {
      title: "Write something",
      description: "Create emails, articles, and professional content.",
      prompt: "Help me write a professional email.",
      icon: MessageSquare,
    },
    {
      title: "Code assistant",
      description: "Get help with programming and debugging.",
      prompt: "Help me understand React hooks.",
      icon: Cpu,
    },
  ];

  return (
    <div className="app">
      {/* Mobile overlay */}
      {mobileMenu && (
        <div className="mobile-overlay" onClick={() => setMobileMenu(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`sidebar ${
          sidebarOpen ? "sidebar-open" : "sidebar-closed"
        } ${mobileMenu ? "mobile-open" : ""}`}
      >
        <div className="sidebar-top">
          <div className="brand">
            <div className="brand-icon">
              <Bot size={23} />
            </div>

            {sidebarOpen && (
              <div className="brand-name">
                <span>LOCAL AI</span>
                <small>INTELLIGENCE PLATFORM</small>
              </div>
            )}

            <button
              className="icon-button mobile-close"
              onClick={() => setMobileMenu(false)}
              aria-label="Close menu"
            >
              <X size={19} />
            </button>
          </div>

          <button className="new-chat-button" onClick={newChat}>
            <Plus size={19} />

            {sidebarOpen && <span>New conversation</span>}
          </button>

          {sidebarOpen && (
            <div className="sidebar-section">
              <span className="section-label">WORKSPACE</span>

              <div className="sidebar-item active">
                <MessageSquare size={17} />
                <span>Current conversation</span>
              </div>

              <div className="sidebar-item">
                <Sparkles size={17} />
                <span>AI Assistant</span>
              </div>
            </div>
          )}
        </div>

        <div className="sidebar-bottom">
          <div className="model-card">
            <div className="model-icon">
              <Cpu size={18} />
            </div>

            {sidebarOpen && (
              <div className="model-info">
                <span>Running locally</span>
                <small>Llama 3.1 · 8B</small>
              </div>
            )}

            <span className="online-dot" />
          </div>

          {sidebarOpen && (
            <div className="sidebar-footer">
              <span>LOCAL AI ASSISTANT</span>
              <span>v1.0.0</span>
            </div>
          )}
        </div>
      </aside>

      {/* Main area */}
      <div className="main-area">
        {/* Header */}
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="icon-button desktop-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? (
                <PanelLeftClose size={19} />
              ) : (
                <PanelLeftOpen size={19} />
              )}
            </button>

            <button
              className="icon-button mobile-toggle"
              onClick={() => setMobileMenu(true)}
              aria-label="Open menu"
            >
              <Menu size={21} />
            </button>

            <div className="breadcrumb">
              <span>Workspace</span>
              <span className="breadcrumb-separator">/</span>
              <strong>AI Assistant</strong>
            </div>
          </div>

          <div className="topbar-right">
            <div className="connection-status">
              <span className="online-dot" />
              <span>Local server</span>
            </div>

            <div className="topbar-divider" />

            <div className="profile">
              <div className="profile-avatar">AI</div>
              <span>Assistant</span>
              <ChevronDown size={15} />
            </div>
          </div>
        </header>

        {/* Chat content */}
        <main className="chat-container">
          <div className="chat-content">
            {messages.length === 0 ? (
              /* Welcome screen */
              <section className="welcome-screen">
                <div className="welcome-label">
                  <Sparkles size={15} />
                  <span>YOUR PERSONAL AI WORKSPACE</span>
                </div>

                <h1>
                  Intelligence,
                  <br />
                  <span>at your fingertips.</span>
                </h1>

                <p className="welcome-description">
                  Your local AI assistant is ready to help you explore ideas,
                  solve problems, write content, and build something
                  extraordinary.
                </p>

                <div className="suggestion-header">
                  <span>GET STARTED</span>
                  <span>CHOOSE A PROMPT</span>
                </div>

                <div className="suggestion-grid">
                  {suggestions.map((item, index) => {
                    const Icon = item.icon;

                    return (
                      <button
                        className="suggestion-card"
                        key={index}
                        onClick={() => sendMessage(item.prompt)}
                      >
                        <div className="suggestion-icon">
                          <Icon size={20} />
                        </div>

                        <div className="suggestion-text">
                          <h3>{item.title}</h3>
                          <p>{item.description}</p>
                        </div>

                        <ArrowUp className="suggestion-arrow" size={18} />
                      </button>
                    );
                  })}
                </div>

                <div className="welcome-footer">
                  <div className="welcome-footer-line" />
                  <span>POWERED BY LLAMA 3.1 · 8B</span>
                  <div className="welcome-footer-line" />
                </div>
              </section>
            ) : (
              /* Conversation */
              <section className="conversation">
                <div className="conversation-heading">
                  <div>
                    <span className="eyebrow">CONVERSATION</span>
                    <h2>Let's explore your ideas.</h2>
                  </div>

                  <button className="clear-button" onClick={newChat}>
                    <Trash2 size={15} />
                    Clear chat
                  </button>
                </div>

                {messages.map((msg, index) => (
                  <div
                    className={`message-row ${
                      msg.role === "user" ? "user-row" : "assistant-row"
                    }`}
                    key={index}
                  >
                    <div className="message-avatar">
                      {msg.role === "user" ? (
                        <User size={18} />
                      ) : (
                        <Bot size={19} />
                      )}
                    </div>

                    <div className="message-body">
                      <div className="message-meta">
                        <span>
                          {msg.role === "user" ? "You" : "AI Assistant"}
                        </span>

                        {msg.role === "assistant" && (
                          <span className="ai-badge">LLAMA 3.1</span>
                        )}
                      </div>

                      <div
                        className={`message-text ${
                          msg.error ? "error-message" : ""
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Skeleton loading */}
                {loading && (
                  <div className="message-row assistant-row">
                    <div className="message-avatar">
                      <Bot size={19} />
                    </div>

                    <div className="message-body">
                      <div className="message-meta">
                        <span>AI Assistant</span>
                        <span className="ai-badge">THINKING</span>
                      </div>

                      <div className="skeleton-container">
                        <div className="thinking-label">
                          <span className="thinking-dot" />
                          Generating response...
                        </div>

                        <div className="skeleton skeleton-line long" />
                        <div className="skeleton skeleton-line medium" />
                        <div className="skeleton skeleton-line short" />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={chatEndRef} />
              </section>
            )}
          </div>

          {/* Input section */}
          <div className="input-section">
            <div className="input-box">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Ask me anything..."
                rows={1}
                disabled={loading}
              />

              <button
                className="send-button"
                onClick={() => sendMessage()}
                disabled={!input.trim() || loading}
                aria-label="Send message"
              >
                <Send size={18} />
              </button>
            </div>

            <div className="input-footer">
              <span>
                <kbd>ENTER</kbd> to send
                <span className="footer-dot">·</span>
                <kbd>SHIFT + ENTER</kbd> for new line
              </span>

              <span className="powered-label">
                <span className="online-dot" />
                YOUR DATA STAYS LOCAL
              </span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;

