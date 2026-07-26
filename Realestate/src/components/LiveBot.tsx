import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  X,
  Send,
  Bot,
  User,
  Sparkles,
  Phone,
  CalendarCheck,
  Building2,
  MapPin,
  CheckCircle2,
  RefreshCw,
  ChevronRight,
} from "lucide-react";
import {
  useAllProperties,
  useCategories,
  useFaqs,
  useContactInfo,
  submitEnquiry,
  submitSiteVisit,
  formatPrice,
  formatWhatsAppUrl,
  TARGET_WHATSAPP_NUMBER,
} from "@/lib/api";

interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
  time: string;
  options?: { label: string; action: () => void }[];
}

export default function LiveBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasPrompted, setHasPrompted] = useState(true);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);

  const { data: properties = [] } = useAllProperties();
  const { data: categories = [] } = useCategories();
  const { data: faqs = [] } = useFaqs();
  const contact = useContactInfo();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const getTimeString = () =>
    new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

  const initialBotMessage: Message = {
    id: "msg-welcome",
    sender: "bot",
    text: "Namaste! 🙏 Welcome to YR Realty. I am your Live AI Property Assistant.\nHow can I help you find your dream property today?",
    time: getTimeString(),
    options: [
      { label: "🏡 Explore Available Properties", action: () => handleQuickAction("properties") },
      { label: "📍 Search by Location", action: () => handleQuickAction("location") },
      { label: "📅 Schedule Free Site Visit", action: () => handleQuickAction("visit") },
      { label: "📞 Request Instant Callback", action: () => handleQuickAction("callback") },
    ],
  };

  const [messages, setMessages] = useState<Message[]>([initialBotMessage]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleQuickAction = (key: string) => {
    if (key === "properties") {
      const sample = properties.slice(0, 3);
      let text = "Here are some of our top verified listings:\n\n";
      if (sample.length) {
        sample.forEach((p) => {
          text += `• ${p.title} (${p.location}) - ${formatPrice(p.discountPrice ?? p.price)}\n`;
        });
      } else {
        text += "• Residential Plots in Delhi NCR starting @ ₹ 15 Lakhs\n• Luxury Villas in Gurugram\n• Commercial Plots in Noida";
      }
      text += "\nWould you like to schedule a free site visit to see these in person?";
      addBotMessage(text, [
        { label: "📅 Book Site Visit", action: () => handleQuickAction("visit") },
        { label: "📞 Speak to Advisor", action: () => handleQuickAction("callback") },
      ]);
    } else if (key === "location") {
      const locs = [...new Set(properties.map((p) => p.location).filter(Boolean))];
      const locList = locs.length ? locs.join(", ") : "Delhi NCR, Noida, Gurugram, Faridabad, Ghaziabad";
      addBotMessage(
        `We have verified projects in prime locations across:\n📍 ${locList}.\n\nWhich area are you interested in? Type the location name below!`
      );
    } else if (key === "visit") {
      addBotMessage(
        "Free Site Visit Booking 🚗\nPlease type your Name and Phone Number below (e.g. 'Rahul Sharma 9876543210') and our advisor will pick you up!"
      );
    } else if (key === "callback") {
      addBotMessage(
        `Our experts are ready to assist you! 📞\nCall us directly at ${contact.phones[0] || "+91 99714 05532"} or reply with your phone number for an instant callback.`
      );
    }
  };

  const addBotMessage = (text: string, options?: Message["options"]) => {
    const newMsg: Message = {
      id: `bot-${Date.now()}`,
      sender: "bot",
      text,
      time: getTimeString(),
      options,
    };
    setMessages((prev) => [...prev, newMsg]);
  };

  const handleSend = async (customText?: string) => {
    const query = (customText || input).trim();
    if (!query) return;

    if (!customText) setInput("");

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: query,
      time: getTimeString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setSending(true);

    // AI Intent Processing Logic
    setTimeout(async () => {
      const lower = query.toLowerCase();

      // Check if phone number is present in message (Lead Capture!)
      const phoneMatch = query.match(/(\+91[\-\s]?)?[6-9]\d{9}/);
      if (phoneMatch) {
        const extractedPhone = phoneMatch[0];
        const userName = query.replace(extractedPhone, "").trim() || "Website Chat User";
        const waText =
          `💬 *New Live Chat Lead - YR Realty*\n\n` +
          `👤 *Name:* ${userName}\n` +
          `📞 *Phone:* ${extractedPhone}\n` +
          `💬 *Query:* ${query}`;
        const waUrl = formatWhatsAppUrl(waText, contact.whatsapp || TARGET_WHATSAPP_NUMBER);

        try {
          await submitEnquiry({
            name: userName,
            phone: extractedPhone,
            message: `User message from Live Bot: "${query}"`,
            sourcePage: "live-bot",
          });
          window.open(waUrl, "_blank", "noopener,noreferrer");
          addBotMessage(
            `Thank you! 🎉 Your details have been submitted.\nOur team has received your notification and will call you on ${extractedPhone} within 15 minutes!`,
            [
              { label: `💬 Connect on WhatsApp (${contact.whatsapp})`, action: () => window.open(waUrl, "_blank") },
              { label: "🏡 Explore More Properties", action: () => handleQuickAction("properties") },
            ]
          );
        } catch {
          window.open(waUrl, "_blank", "noopener,noreferrer");
          addBotMessage(
            `Got your number (${extractedPhone})! An expert advisor will reach out to you shortly.`
          );
        }
        setSending(false);
        return;
      }

      // Query processing
      if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey") || lower.includes("namaste")) {
        addBotMessage(
          "Hello! 👋 Glad to connect. Are you looking to buy a plot, villa, flat, or commercial property?",
          [
            { label: "Residential Plots", action: () => handleQuickAction("properties") },
            { label: "Book Site Visit", action: () => handleQuickAction("visit") },
          ]
        );
      } else if (lower.includes("price") || lower.includes("budget") || lower.includes("cost") || lower.includes("lakh") || lower.includes("crore")) {
        addBotMessage(
          "We offer verified properties for every budget range!\n• Plots: Starting ₹15 Lakhs onwards\n• Luxury Villas: ₹85 Lakhs to ₹2.5 Cr\n• Commercial Plots: Flexible pricing with high ROI.\n\nWould you like a detailed price list for a specific location?",
          [{ label: "📅 Schedule Free Visit", action: () => handleQuickAction("visit") }]
        );
      } else if (lower.includes("rera") || lower.includes("verify") || lower.includes("legal") || lower.includes("document")) {
        addBotMessage(
          "✓ 100% Legal & RERA Verified Guarantee!\nAll properties listed on YR Realty undergo strict legal title verification, clear registry documentation, and RERA compliance before listing."
        );
      } else if (lower.includes("visit") || lower.includes("see") || lower.includes("book") || lower.includes("tour")) {
        handleQuickAction("visit");
      } else if (lower.includes("contact") || lower.includes("call") || lower.includes("number") || lower.includes("phone")) {
        handleQuickAction("callback");
      } else {
        // Fallback matched answer
        const matchedFaq = faqs.find(
          (f) =>
            lower.includes(f.question.toLowerCase()) ||
            f.question.toLowerCase().includes(lower)
        );

        if (matchedFaq) {
          addBotMessage(matchedFaq.answer);
        } else {
          addBotMessage(
            `Thank you for your question. I have forwarded your query "${query}" to our senior property consultant.\n\nWould you like an instant callback or a free site visit?`,
            [
              { label: "📞 Request Callback", action: () => handleQuickAction("callback") },
              { label: "📅 Book Site Visit", action: () => handleQuickAction("visit") },
            ]
          );
        }
      }
      setSending(false);
    }, 600);
  };

  return (
    <>
      {/* Floating Bot Button & Label Pill (Right Side) */}
      <div className="fixed right-4 bottom-24 sm:bottom-6 z-40 flex items-center gap-2.5">
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              initial={{ opacity: 0, x: 10, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 10, scale: 0.95 }}
              className="relative"
            >
              {/* Permanent clear text badge */}
              <button
                onClick={() => {
                  setIsOpen(true);
                  setHasPrompted(false);
                }}
                className="flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full bg-neutral-900/95 text-white text-xs font-bold border border-amber-400/50 shadow-[0_8px_25px_rgba(0,0,0,0.35)] hover:bg-neutral-800 transition-all cursor-pointer backdrop-blur-md group"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                <span className="text-amber-200 group-hover:text-white transition-colors">Ask AI Assistant 💬</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Speech popup */}
        <AnimatePresence>
          {hasPrompted && !isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute bottom-16 right-0 bg-neutral-900 text-white text-xs p-3.5 rounded-2xl shadow-2xl border border-amber-400/40 w-64 mb-2 pointer-events-auto"
            >
              <button
                onClick={() => setHasPrompted(false)}
                className="absolute top-1.5 right-1.5 text-white/50 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              <div className="flex items-center gap-2 mb-1.5 text-amber-300 font-bold">
                <Sparkles className="w-4 h-4" /> 🤖 YR Live AI Assistant
              </div>
              <p className="text-white/85 leading-relaxed text-[11px]">
                Have a question about properties, prices, or site visits? Chat with our AI bot live!
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => {
            setIsOpen(!isOpen);
            setHasPrompted(false);
          }}
          aria-label="Open AI Assistant"
          className="relative group w-14 h-14 sm:w-15 sm:h-15 rounded-full bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-950 p-0.5 shadow-[0_8px_30px_rgba(0,0,0,0.45)] ring-2 ring-amber-400/70 hover:scale-105 transition-all duration-300 flex items-center justify-center overflow-hidden shrink-0"
        >
          <span className="absolute top-0 right-0 flex h-4 w-4 z-10">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white"></span>
          </span>

          {isOpen ? (
            <div className="w-full h-full bg-neutral-900 grid place-items-center rounded-full text-white">
              <X className="w-6 h-6 text-amber-300" />
            </div>
          ) : (
            <img
              src="/bot-avatar.png"
              alt="3D YR AI Bot"
              className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-300"
            />
          )}
        </button>
      </div>

      {/* Live Chat Modal Window (Right Side) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-28 sm:bottom-28 left-4 sm:left-auto right-4 sm:right-4 sm:w-[380px] h-[520px] max-h-[70vh] bg-white rounded-3xl z-50 shadow-[0_20px_60px_rgba(0,0,0,0.35)] border border-amber-200/80 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 text-white flex items-center justify-between border-b border-amber-400/20">
              <div className="flex items-center gap-3">
                <img
                  src="/bot-avatar.png"
                  alt="3D YR AI Assistant"
                  className="w-10 h-10 rounded-2xl object-cover ring-2 ring-amber-400/50 shadow-md"
                />
                <div>
                  <h3 className="font-display font-bold text-sm text-white flex items-center gap-1.5">
                    YR AI Assistant
                    <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
                  </h3>
                  <p className="text-[10px] text-amber-200/80 font-medium">Instant Property Resolution • Live 24/7</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setMessages([initialBotMessage])}
                  title="Reset conversation"
                  className="w-8 h-8 grid place-items-center rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 grid place-items-center rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-neutral-50/50">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
                >
                  <div className="flex items-start gap-2 max-w-[88%]">
                    {msg.sender === "bot" && (
                      <img
                        src="/bot-avatar.png"
                        alt="Bot"
                        className="w-7 h-7 rounded-full object-cover shrink-0 mt-1 ring-1 ring-amber-400/50 shadow-xs"
                      />
                    )}
                    <div
                      className={`p-3.5 rounded-2xl text-xs leading-relaxed whitespace-pre-line shadow-sm ${
                        msg.sender === "user"
                          ? "bg-neutral-900 text-white rounded-br-none"
                          : "bg-white text-neutral-800 border border-neutral-200/70 rounded-bl-none"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                  <span className="text-[9px] text-neutral-400 px-2 mt-1">{msg.time}</span>

                  {/* Interactive Option Pills */}
                  {msg.options && (
                    <div className="mt-2.5 flex flex-col gap-1.5 w-full pl-9">
                      {msg.options.map((opt, idx) => (
                        <button
                          key={idx}
                          onClick={opt.action}
                          className="text-left text-xs font-semibold px-3 py-2 rounded-xl bg-white border border-amber-300/80 text-neutral-900 hover:bg-amber-50 hover:border-amber-400 transition-colors flex items-center justify-between shadow-xs"
                        >
                          <span>{opt.label}</span>
                          <ChevronRight className="w-3.5 h-3.5 text-amber-600" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {sending && (
                <div className="flex items-center gap-2 text-xs text-neutral-400 pl-2">
                  <img src="/bot-avatar.png" alt="Bot" className="w-4 h-4 rounded-full animate-bounce" />
                  <span>Assistant is typing…</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="p-3 bg-white border-t border-neutral-200/80 flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about properties, prices, or site visits..."
                className="flex-1 h-10 px-3.5 rounded-xl border border-neutral-200 bg-neutral-50 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
              />
              <button
                type="submit"
                disabled={!input.trim() || sending}
                className="w-10 h-10 grid place-items-center rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-neutral-950 disabled:opacity-50 hover:scale-105 transition-transform shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
