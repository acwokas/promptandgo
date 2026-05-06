export interface Author {
  name: string;
  title?: string;
  bio?: string;
  sameAs?: string[];
}

export const AUTHOR_MAIN: Author = {
  name: "PromptAndGo Editorial Team",
  title: "Editorial Team",
  bio: "We research, test, and publish field‑proven prompts so you get better results faster.",
  sameAs: [
    "https://promptandgo.ai/",
    "https://promptandgo.ai/rss.xml",
  ],
};
