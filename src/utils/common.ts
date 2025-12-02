export const APP_NAME = "Visibility"

export interface Platform {
  id: "openai" | "gemini" | "perplexity";
  name: string;
  logoUrl: string;
}

export const platforms: Platform[] = [
  {
    id: "openai",
    name: "OpenAI",
    logoUrl: "/logos/openai.png",
  },
  {
    id: "gemini",
    name: "Gemini",
    logoUrl: "/logos/gemini.png",
  },
  {
    id: "perplexity",
    name: "Perplexity",
    logoUrl: "/logos/perplexity.png",
  },
];
