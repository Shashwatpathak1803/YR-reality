import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, X, Share, MoreVertical, Plus } from "lucide-react";

/**
 * InstallPrompt — shows a rich "Install App" CTA
 *
 * • On Android/Chrome: captures the `beforeinstallprompt` event and shows
 *   a custom amber-styled banner.
 * • On iOS/Safari: shows step-by-step instructions (Share → Add to Home Screen).
 * • Dismissed state persists for 7 days in localStorage.
 */

function isIos() {
  return (
    /iphone|ipad|ipod/i.test(navigator.userAgent) &&
    !(window as unknown as { MSStream?: unknown }).MSStream
  );
}

function isInStandaloneMode() {
  return (
    ("standalone" in window.navigator && (window.navigator as { standalone?: boolean }).standalone) ||
    window.matchMedia("(display-mode: standalone)").matches
  );
}

const DISMISS_KEY = "yr-pwa-dismissed-at";
const DISMISS_DAYS = 7;

export default function InstallPrompt() {
  const [showAndroid, setShowAndroid] = useState(false);
  const [showIos, setShowIos] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<Event & { prompt: () => void; userChoice: Promise<{ outcome: string }> } | null>(null);
  const [iosStep, setIosStep] = useState<"guide" | "done">("guide");

  useEffect(() => {
    // If already installed or user dismissed recently — skip
    if (isInStandaloneMode()) return;
    const dismissedAt = localStorage.getItem(DISMISS_KEY);
    if (dismissedAt) {
      const age = (Date.now() - parseInt(dismissedAt)) / 86_400_000;
      if (age < DISMISS_DAYS) return;
    }

    // Android / Chrome
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as Event & { prompt: () => void; userChoice: Promise<{ outcome: string }> });
      setShowAndroid(true);
    };
    window.addEventListener("beforeinstallprompt", handler);

    // Show prompt after 1.5s on desktop / browsers if not installed
    const devTimer = setTimeout(() => {
      if (!isIos()) {
        setShowAndroid(true);
      }
    }, 1500);

    // iOS Safari (no beforeinstallprompt — show manual guide after 2 s)
    if (isIos()) {
      const timer = setTimeout(() => setShowIos(true), 2000);
      return () => {
        window.removeEventListener("beforeinstallprompt", handler);
        clearTimeout(timer);
        clearTimeout(devTimer);
      };
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      clearTimeout(devTimer);
    };
  }, []);

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, Date.now().toString());
    setShowAndroid(false);
    setShowIos(false);
  };

  const handleInstall = async () => {
    if (!deferredPrompt) {
      alert("To install YR Realty:\n• Chrome/Edge: Click the Install icon (🖥️ or ➕) in the top right address bar.\n• Android: Tap ⁝ (three dots) -> 'Install App' or 'Add to Home screen'.");
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShowAndroid(false);
      localStorage.setItem(DISMISS_KEY, Date.now().toString());
    }
    setDeferredPrompt(null);
  };

  return (
    <>
      {/* ── Android Install Banner ── */}
      <AnimatePresence>
        {showAndroid && (
          <motion.div
            initial={{ y: 120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 120, opacity: 0 }}
            transition={{ type: "spring", damping: 22 }}
            className="fixed bottom-20 sm:bottom-6 inset-x-3 sm:inset-x-auto sm:right-5 sm:left-auto sm:w-[360px] z-[9999]"
          >
            <div className="relative rounded-2xl bg-neutral-900 border border-amber-400/40 shadow-[0_20px_60px_rgba(0,0,0,0.6)] p-4 flex items-center gap-3 overflow-hidden">
              {/* Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-transparent to-transparent pointer-events-none" />

              {/* App Icon */}
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shrink-0 shadow-lg">
                <span className="font-black text-neutral-950 text-lg leading-none">YR</span>
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold text-sm">Install YR Realty App</p>
                <p className="text-white/60 text-xs mt-0.5 truncate">
                  Find properties instantly • Works offline
                </p>
              </div>

              {/* Install Button */}
              <button
                onClick={handleInstall}
                className="shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-neutral-950 font-bold text-xs shadow hover:scale-105 transition-transform"
              >
                <Download className="w-3.5 h-3.5" />
                Install
              </button>

              {/* Close */}
              <button
                onClick={dismiss}
                className="absolute top-2 right-2 w-6 h-6 grid place-items-center rounded-full text-white/40 hover:text-white/80 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── iOS Install Guide ── */}
      <AnimatePresence>
        {showIos && (
          <motion.div
            initial={{ y: 120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 120, opacity: 0 }}
            transition={{ type: "spring", damping: 22 }}
            className="fixed bottom-20 sm:bottom-6 inset-x-3 sm:inset-x-auto sm:right-5 sm:left-auto sm:w-[360px] z-[9999]"
          >
            <div className="relative rounded-2xl bg-neutral-900 border border-amber-400/40 shadow-[0_20px_60px_rgba(0,0,0,0.6)] p-4 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-transparent to-transparent pointer-events-none" />

              <button
                onClick={dismiss}
                className="absolute top-2 right-2 w-6 h-6 grid place-items-center rounded-full text-white/40 hover:text-white/80 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>

              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shrink-0 shadow-lg">
                  <span className="font-black text-neutral-950 text-base leading-none">YR</span>
                </div>
                <div>
                  <p className="text-white font-bold text-sm">Install YR Realty App</p>
                  <p className="text-white/50 text-xs">Add to your iPhone home screen</p>
                </div>
              </div>

              {iosStep === "guide" ? (
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2.5 bg-white/5 rounded-xl p-2.5">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-400/30 flex items-center justify-center shrink-0">
                      <Share className="w-4 h-4 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-white text-xs font-semibold">Step 1</p>
                      <p className="text-white/60 text-[11px]">Tap the <strong className="text-white">Share</strong> button in Safari (bottom bar)</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 bg-white/5 rounded-xl p-2.5">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-400/30 flex items-center justify-center shrink-0">
                      <Plus className="w-4 h-4 text-amber-400" />
                    </div>
                    <div>
                      <p className="text-white text-xs font-semibold">Step 2</p>
                      <p className="text-white/60 text-[11px]">Scroll down and tap <strong className="text-white">"Add to Home Screen"</strong></p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 bg-white/5 rounded-xl p-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center shrink-0">
                      <MoreVertical className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-white text-xs font-semibold">Step 3</p>
                      <p className="text-white/60 text-[11px]">Tap <strong className="text-white">"Add"</strong> — app will appear on home screen!</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setIosStep("done")}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-neutral-950 font-bold text-xs text-center mt-1"
                  >
                    Got it! ✓
                  </button>
                </div>
              ) : (
                <div className="text-center py-3">
                  <div className="text-2xl mb-2">🎉</div>
                  <p className="text-white font-bold text-sm">App is installed!</p>
                  <p className="text-white/50 text-xs mt-1">Find "YR Realty" on your home screen.</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
