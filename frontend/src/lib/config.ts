import { StartScreenPrompt } from "@openai/chatkit";

export const THEME_STORAGE_KEY = "customer-support-theme";
export const THREAD_STORAGE_KEY = "ns-chat-thread";

const SUPPORT_API_BASE =
  import.meta.env.VITE_SUPPORT_API_BASE ?? "/support";

/**
 * ChatKit still expects a domain key at runtime. Use any placeholder locally,
 * but register your production domain at
 * https://platform.openai.com/settings/organization/security/domain-allowlist
 * and deploy the real key.
 */
export const SUPPORT_CHATKIT_API_DOMAIN_KEY =
  import.meta.env.VITE_SUPPORT_CHATKIT_API_DOMAIN_KEY ?? "domain_pk_localhost_dev";

export const SUPPORT_CHATKIT_API_URL =
  import.meta.env.VITE_SUPPORT_CHATKIT_API_URL ??
  `${SUPPORT_API_BASE}/chatkit`;

export const SUPPORT_PROFILE_URL =
  import.meta.env.VITE_SUPPORT_PROFILE_URL ??
  `${SUPPORT_API_BASE}/profile`;

export const SUPPORT_RECOMMEND_PLAN_URL =
  import.meta.env.VITE_SUPPORT_RECOMMEND_PLAN_URL ??
  `${SUPPORT_API_BASE}/recommend_plan`;

export const SUPPORT_RAG_SEARCH_URL =
  import.meta.env.VITE_SUPPORT_RAG_SEARCH_URL ??
  `${SUPPORT_API_BASE}/rag_search`;

export const SUPPORT_GREETING =
  import.meta.env.VITE_SUPPORT_GREETING ??
  "I’m your Nutrition Solutions coach. I’ll guide you through a quick intake and build your plan.";

export const SUPPORT_STARTER_PROMPTS: StartScreenPrompt[] = [
  {
    label: "Start my plan",
    prompt: "Let’s build my Nutrition Solutions plan. My goal is fat loss.",
    icon: "sparkle",
  },
  {
    label: "I’m here to gain muscle",
    prompt: "I want to add lean muscle. Let’s set up my meal plan and schedule.",
    icon: "activity",
  },
  {
    label: "I have questions first",
    prompt: "Before we start, I have a question about pricing and results.",
    icon: "question-mark-circle",
  },
  {
    label: "Show real transformations",
    prompt: "Can you show me transformations for women in their 30s focused on fat loss?",
    icon: "fire",
  },
];
