import { useState } from "react";
import { ChatKit, useChatKit } from "@openai/chatkit-react";
import type { ColorScheme } from "../hooks/useColorScheme";
import {
  SUPPORT_CHATKIT_API_DOMAIN_KEY,
  SUPPORT_CHATKIT_API_URL,
  SUPPORT_GREETING,
  SUPPORT_STARTER_PROMPTS,
  THREAD_STORAGE_KEY,
} from "../lib/config";

type ChatKitPanelProps = {
  theme: ColorScheme;
  onThreadChange: (threadId: string | null) => void;
  onResponseCompleted: () => void;
};

export function ChatKitPanel({ theme, onThreadChange, onResponseCompleted }: ChatKitPanelProps) {
  const [initialThread] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(THREAD_STORAGE_KEY);
  });

  const persistThread = (threadId: string | null) => {
    if (typeof window === "undefined") return;
    if (threadId) {
      window.localStorage.setItem(THREAD_STORAGE_KEY, threadId);
    } else {
      window.localStorage.removeItem(THREAD_STORAGE_KEY);
    }
  };

  const chatkit = useChatKit({
    api: {
      url: SUPPORT_CHATKIT_API_URL,
      domainKey: SUPPORT_CHATKIT_API_DOMAIN_KEY,
    },
    initialThread,
    theme: {
      colorScheme: theme,
      color: {
        grayscale: {
          hue: 220,
          tint: 5,
          shade: theme === "dark" ? -2 : -5,
        },
        accent: {
          primary: theme === "dark" ? "#fef2e8" : "#f97316",
          level: 1,
        },
      },
      radius: "xl",
    },
    startScreen: {
      greeting: SUPPORT_GREETING,
      prompts: SUPPORT_STARTER_PROMPTS,
      title: "Nutrition Solutions AI Coach",
    },
    composer: {
      placeholder: "Ask about your plan, meals, pricing, or anything off-script",
    },
    threadItemActions: {
      feedback: false,
    },
    onResponseEnd: () => {
      onResponseCompleted();
    },
    onThreadChange: ({ threadId }) => {
      persistThread(threadId ?? null);
      onThreadChange(threadId ?? null);
    },
    onError: ({ error }) => {
      // ChatKit surfaces errors in the UI; keep console logging for debugging.
      console.error("ChatKit error", error);
    },
  });

  return (
    <div className="relative h-full w-full overflow-hidden border border-slate-200/60 bg-white shadow-card dark:border-slate-800/70 dark:bg-slate-900">
      <ChatKit control={chatkit.control} className="block h-full w-full" />
    </div>
  );
}
