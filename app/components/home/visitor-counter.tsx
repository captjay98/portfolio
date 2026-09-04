"use client";

import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, MessagesSquare, Users } from "lucide-react";
import { visitorService } from "@app/services/visitorService";
import { getOrCreateSessionId } from "@app/utils/sessionId";

interface VisitorCounterProps {
  className?: string;
}

interface GuestBookMessage {
  $id: string;
  name: string;
  message: string;
  date: string;
}

const VisitorCounter: React.FC<VisitorCounterProps> = ({ className = "" }) => {
  const [messages, setMessages] = useState<GuestBookMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [visitorName, setVisitorName] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isPulsing, setIsPulsing] = useState(false);
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  // Record visit on mount via Cloudflare endpoint in background (non-blocking)
  useEffect(() => {
    const recordVisit = async () => {
      try {
        const sessionId = getOrCreateSessionId();
        const res = await fetch("/api/visitors/record", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            page: window.location.pathname,
            session_id: sessionId,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          if (typeof data.count === "number") {
            setCount(data.count);
          }
        }
      } catch (error) {
        console.error("Error recording visit:", error);
      }
    };

    if (typeof window !== "undefined") {
      if ("requestIdleCallback" in window) {
        (window as any).requestIdleCallback(recordVisit);
      } else {
        setTimeout(recordVisit, 100);
      }
    }
  }, []);

  // Update count periodically (every 60s)
  useEffect(() => {
    const updateCount = async () => {
      try {
        const total = await visitorService.getVisitorCount();
        setCount(total);
      } catch (error) {
        console.error("Error updating count:", error);
      }
    };

    const interval = setInterval(updateCount, 60000);
    return () => clearInterval(interval);
  }, []);

  // Entrance animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500);

    const pulseTimer = setInterval(() => {
      setIsPulsing(true);
      setTimeout(() => setIsPulsing(false), 1000);
    }, 4000);

    return () => {
      clearTimeout(timer);
      clearInterval(pulseTimer);
    };
  }, []);

  // Lazy load guestbook messages on expand
  const handleToggleExpand = async () => {
    const nextState = !isExpanded;
    setIsExpanded(nextState);
    if (nextState && messages.length === 0) {
      try {
        const msgs = await visitorService.getGuestBookMessages();
        setMessages(msgs);
      } catch (err) {
        console.error("Error fetching guestbook:", err);
      }
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !visitorName.trim()) return;

    try {
      setLoading(true);
      await visitorService.addGuestBookMessage(visitorName, newMessage);

      const updatedMessages = await visitorService.getGuestBookMessages();
      setMessages(updatedMessages);

      setNewMessage("");
      setVisitorName("");
      setShowForm(false);
    } catch (error) {
      console.error("Error adding message:", error);

      const newMsg = {
        $id: Date.now().toString(),
        name: visitorName,
        message: newMessage,
        date: new Date().toISOString().split("T")[0],
      };
      setMessages([newMsg, ...messages]);
      setNewMessage("");
      setVisitorName("");
      setShowForm(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div
        className={`rounded-lg overflow-hidden shadow-lg backdrop-blur-sm bg-glass border border-light-subtle/10 dark:border-dark-subtle/20 shadow-accent/5 ${className}`}
      >
        <div className="p-2 sm:p-3 flex items-center gap-2">
          <Users
            size={16}
            className="text-light-accent dark:text-dark-accent animate-pulse"
          />
          <div className="w-16 h-4 bg-light-subtle/20 dark:bg-dark-subtle/20 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`rounded-lg transition-all duration-300 shadow-lg editorial-stamp border border-dashed border-[#e6b450]/40 bg-[#131721]/95 text-xs text-[#d9d7d3] max-w-[calc(100vw-2rem)] ${
        isExpanded ? "w-[calc(100vw-2rem)] max-w-xs sm:w-80" : "w-auto"
      } ${isVisible ? "opacity-100" : "opacity-0"} ${
        isPulsing ? "border-[#e6b450] shadow-[0_0_12px_rgba(230,180,80,0.3)]" : ""
      } ${className}`}
    >
      {/* Header - always visible as editorial seal */}
      <div
        onClick={handleToggleExpand}
        className="flex items-center justify-between p-2.5 sm:p-3 cursor-pointer hover:bg-[#e6b450]/10 transition-colors rounded-t-lg"
      >
        <div
          className={`flex items-center gap-2 font-mono ${isPulsing ? "text-[#e6b450]" : ""}`}
        >
          <span className="relative flex items-center justify-center w-5 h-5 rounded border border-[#e6b450]/50 bg-[#e6b450]/10 text-[#e6b450]">
            {isExpanded ? (
              <MessagesSquare size={13} />
            ) : (
              <Users size={13} />
            )}
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#e6b450] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#e6b450]"></span>
            </span>
          </span>
          <div className="flex flex-col">
            <span className="text-[10px] tracking-wider uppercase text-[#949dab]">
              {isExpanded ? "Guest Book // Journal" : "Archival Stamp"}
            </span>
            <span className="font-mono text-xs font-semibold text-[#d9d7d3]">
              {isExpanded ? "Correspondence" : "Reader №"}
              {!isExpanded && (
                <span className="text-[#e6b450] ml-1">
                  {count?.toLocaleString() || "0"}
                </span>
              )}
            </span>
          </div>
        </div>
        <button className="text-[#949dab] hover:text-[#e6b450] transition-colors ml-3 p-1">
          {isExpanded ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
        </button>
      </div>

      {/* Expandable content */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out rounded-b-lg
          ${isExpanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}
      >
        <div className="p-4 bg-slate-900/10 dark:bg-slate-900/50 backdrop-blur-sm border-b border-gray-100/10 dark:border-slate-700/20">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200 animate-fade-in">
              Guest Book
            </h3>
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-2.5 py-1.5 text-sm bg-accent-gradient text-white rounded hover:shadow-accent transition-all hover:scale-105 active:scale-95"
            >
              {showForm ? "Cancel" : "Sign"}
            </button>
          </div>

          {/* Form */}
          {showForm && (
            <form onSubmit={handleSubmit} className="mb-4 animate-fade-in">
              <input
                type="text"
                placeholder="Your Name"
                value={visitorName}
                onChange={(e) => setVisitorName(e.target.value)}
                className="w-full mb-2 p-2 text-sm rounded border border-light-subtle/20 dark:border-dark-subtle/20 bg-light-background/80 dark:bg-dark-background/80 text-light-text dark:text-dark-text focus:outline-none focus:ring-1 focus:ring-light-accent dark:focus:ring-dark-accent"
                required
              />
              <textarea
                placeholder="Leave a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="w-full mb-2 p-2 text-sm rounded border border-light-subtle/20 dark:border-dark-subtle/20 bg-light-background/80 dark:bg-dark-background/80 text-light-text dark:text-dark-text focus:outline-none focus:ring-1 focus:ring-light-accent dark:focus:ring-dark-accent"
                rows={2}
                required
              ></textarea>
              <button
                type="submit"
                className="w-full py-1.5 bg-accent-gradient text-white rounded text-sm hover:shadow-accent transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Send Message
              </button>
            </form>
          )}

          {/* Messages list */}
          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
            {messages.length > 0 ? (
              messages.map((msg) => (
                <div
                  key={msg.$id}
                  className="p-2 rounded bg-light-subtle/10 dark:bg-dark-subtle/10 border border-light-subtle/10 dark:border-dark-subtle/10 animate-fade-in"
                >
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="font-medium text-xs text-light-accent dark:text-dark-accent">
                      {msg.name}
                    </span>
                    <span className="text-[10px] text-light-subtle dark:text-dark-subtle">
                      {msg.date}
                    </span>
                  </div>
                  <p className="text-xs text-light-text dark:text-dark-text">
                    {msg.message}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-xs text-center py-4 text-light-subtle dark:text-dark-subtle">
                No messages yet. Be the first to leave one!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisitorCounter;
