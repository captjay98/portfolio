"use client";

import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, MessagesSquare, Users } from "lucide-react";
import { visitorService } from "@/services/visitorService";
import { getOrCreateSessionId } from "@/utils/sessionId";

interface VisitorCounterProps {
  className?: string;
}

interface GuestBookMessage {
  $id: string;
  name: string;
  message: string;
  date: string;
}

interface IpifyResponse {
  ip: string;
}

interface GeoResponse {
  country_code: string;
  country_name: string;
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

  // Record visit on mount
  useEffect(() => {
    const recordVisit = async () => {
      try {
        // Get or create session ID
        const sessionId = getOrCreateSessionId();

        // Get client IP with proper typing
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json() as IpifyResponse;
        
        // Get geolocation data with proper typing
        const geoResponse = await fetch(`https://ipapi.co/${ipData.ip}/json/`);
        const geoData = await geoResponse.json() as GeoResponse;

        // Record the visit with proper types
        await visitorService.recordVisit({
          ip_address: ipData.ip,
          user_agent: navigator.userAgent,
          referrer: document.referrer || "",
          country_code: geoData.country_code || "Unknown",
          country_name: geoData.country_name || "Unknown",
          page: window.location.pathname,
          session_id: sessionId,
        });

        // Update total count
        const total = await visitorService.getVisitorCount();
        setCount(total);

        // Fetch initial messages
        const initialMessages = await visitorService.getGuestBookMessages();
        setMessages(initialMessages);
      } catch (error) {
        console.error("Error recording visit:", error);
      }
    };

    recordVisit();
  }, []);

  // Update count periodically
  useEffect(() => {
    const updateCount = async () => {
      try {
        const total = await visitorService.getVisitorCount();
        setCount(total);
      } catch (error) {
        console.error("Error updating count:", error);
      }
    };

    const interval = setInterval(updateCount, 30000);
    return () => clearInterval(interval);
  }, []);

  // Entrance animation
  useEffect(() => {
   
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500);

    // Start pulsing animation every 5 seconds
    const pulseTimer = setInterval(() => {
      setIsPulsing(true);
      setTimeout(() => setIsPulsing(false), 1000);
    }, 4000);

    return () => {
      clearTimeout(timer);
      clearInterval(pulseTimer);
    };
  }, []);

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
      className={`rounded-lg transition-all duration-500 shadow-lg bg-glass border border-light-subtle/10 dark:border-dark-subtle/20 shadow-accent/5 effect-3d
        ${isVisible ? "opacity-100" : "opacity-0"}
        ${isPulsing ? "animate-wiggle shadow-accent/20" : ""} ${className}`}
      style={{ width: isExpanded ? "320px" : "auto" }}
    >
      {/* Header - always visible */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between p-2 sm:p-3 cursor-pointer bg-light-subtle/5 dark:bg-slate-800/50 backdrop-blur-sm hover:bg-light-subtle/10 dark:hover:bg-slate-800/70 transition-colors rounded-lg"
      >
        <p
          className={`text-sm sm:text-base font-medium text-light-text dark:text-dark-text flex items-center gap-2 ${isPulsing ? "animate-pulse" : ""}`}
        >
          <span className="relative">
            {isExpanded ? (
              <MessagesSquare
                size={18}
                className="text-light-accent dark:text-dark-accent"
              />
            ) : (
              <Users
                size={18}
                className="text-light-accent dark:text-dark-accent"
              />
            )}
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-gradient opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-light-accent dark:bg-dark-accent"></span>
            </span>
          </span>
          {isExpanded ? "Guest Book" : "Hi, Visitor:"}
          <span
            className={`font-mono ${isPulsing ? "text-light-accent dark:text-dark-accent scale-110 transition-all" : ""}`}
          >
            {count?.toLocaleString() || "0"}
          </span>
        </p>
        <button className="text-light-subtle dark:text-dark-subtle hover:text-light-accent dark:hover:text-dark-accent transition-transform hover:scale-110 ml-2">
          {isExpanded ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
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
              {showForm ? "Cancel" : "Leave a message"}
            </button>
          </div>

          {showForm && (
            <form
              onSubmit={handleSubmit}
              className="mb-3 space-y-2.5 animate-fade-in"
            >
              <input
                type="text"
                placeholder="Your name"
                value={visitorName}
                onChange={(e) => setVisitorName(e.target.value)}
                className="w-full p-2.5 text-sm rounded bg-white/40 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700/40 focus:ring-1 focus:ring-blue-500 outline-none text-gray-900 dark:text-gray-100 transition-all hover:border-blue-300"
                required
              />
              <textarea
                placeholder="Your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="w-full p-2.5 text-sm rounded bg-white/40 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700/40 focus:ring-1 focus:ring-blue-500 outline-none text-gray-900 dark:text-gray-100 transition-all hover:border-blue-300"
                rows={2}
                required
              ></textarea>
              <button
                type="submit"
                className="px-3.5 py-1.5 text-sm bg-accent-gradient text-white rounded hover:shadow-accent transition-all hover:shadow-md hover:scale-105 active:scale-95"
              >
                Post
              </button>
            </form>
          )}
        </div>

        <div className="max-h-64 overflow-y-auto p-3 bg-slate-900/5 dark:bg-slate-900/30 backdrop-blur-sm">
          <div className="space-y-2.5">
            {messages.length > 0 ? (
              // Ensure messages are displayed with newest first
              [...messages].map((message, index) => (
                <div
                  key={message.$id}
                  className="p-2.5 border-l-2 border-light-accent dark:border-dark-accent bg-white/40 dark:bg-slate-800/50 rounded shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all animate-fade-in-up"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="flex justify-between items-start flex-wrap gap-1">
                    <p className="font-medium text-sm text-gray-800 dark:text-gray-200">
                      {message.name}
                    </p>
                    <span className="text-[10px] bg-gray-100/50 dark:bg-slate-700/50 text-gray-700 dark:text-gray-300 px-1.5 py-0.5 rounded-full">
                      {message.date}
                    </span>
                  </div>
                  <p className="mt-1.5 text-sm text-gray-700 dark:text-gray-300">
                    {message.message}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-center text-sm text-gray-500 dark:text-gray-400 py-2.5">
                No messages yet. Be the first to write!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisitorCounter;
