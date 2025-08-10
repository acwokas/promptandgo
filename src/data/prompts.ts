export type Category = {
  id: string;
  name: string;
  subcategories: { id: string; name: string }[];
};

export type Prompt = {
  id: string;
  categoryId: string;
  subcategoryId: string;
  title: string;
  whatFor: string; // short description
  prompt: string;
  imagePrompt: string;
  excerpt: string;
  tags: string[];
};

export const categories: Category[] = [
  {
    id: "marketing",
    name: "Marketing",
    subcategories: [
      { id: "email-campaigns", name: "Email Campaigns" },
      { id: "ad-copy", name: "Ad Copy" },
      { id: "seo", name: "SEO" },
    ],
  },
  {
    id: "productivity",
    name: "Productivity",
    subcategories: [
      { id: "task-planning", name: "Task Planning" },
      { id: "automation", name: "Automation" },
    ],
  },
  {
    id: "sales",
    name: "Sales",
    subcategories: [
      { id: "outreach", name: "Outreach" },
      { id: "follow-up", name: "Follow-Up" },
    ],
  },
];

export const prompts: Prompt[] = [
  {
    id: "1",
    categoryId: "marketing",
    subcategoryId: "email-campaigns",
    title: "Newsletter Outline Generator",
    whatFor: "Plan a weekly newsletter with sections, hooks, and CTAs.",
    prompt:
      "You are an expert content strategist. Create a newsletter outline for [audience] about [topic]. Include 5 sections with catchy headings, 1 featured story, 3 quick tips, and a primary CTA.",
    imagePrompt:
      "flat illustration, newsletter layout, blue accent, minimal icons, 4:3 aspect",
    excerpt: "Generate a clear, repeatable email structure in seconds.",
    tags: ["email", "newsletter", "content"],
  },
  {
    id: "2",
    categoryId: "marketing",
    subcategoryId: "ad-copy",
    title: "High-Intent Ad Variations",
    whatFor: "Create 5 ad versions for a single offer with angles.",
    prompt:
      "Write 5 paid social ad variants for [offer] targeting [audience]. Each variant should use a different angle (pain, desire, social proof, urgency, curiosity) and include headline + primary text + CTA.",
    imagePrompt: "ad concepts, simple shapes, blue gradient, 16:9",
    excerpt: "Quickly explore angles that convert.",
    tags: ["ads", "copy", "social"],
  },
  {
    id: "3",
    categoryId: "productivity",
    subcategoryId: "task-planning",
    title: "Weekly Plan with Time Blocks",
    whatFor: "A realistic schedule with priorities and buffers.",
    prompt:
      "Act as a productivity coach. Create a weekly plan for [role] with time blocks based on [goals]. Include maker/manager mode, buffer times, and 3 top priorities per day.",
    imagePrompt: "calendar blocks, clean, blue highlight, 16:9",
    excerpt: "Stay on track with a plan you can follow.",
    tags: ["planning", "time", "focus"],
  },
  {
    id: "4",
    categoryId: "sales",
    subcategoryId: "outreach",
    title: "Cold Email First Touch",
    whatFor: "Personalized opener based on prospect signals.",
    prompt:
      "Write a concise first-touch cold email to [prospect type] about [offer]. Personalize using [signal], keep under 120 words, include a soft CTA with a question.",
    imagePrompt: "paper plane icon, gradient, minimal, square",
    excerpt: "Short emails that get replies.",
    tags: ["email", "sales", "outreach"],
  },
  {
    id: "5",
    categoryId: "marketing",
    subcategoryId: "seo",
    title: "Keyword Cluster Brainstorm",
    whatFor: "Find related keywords to target a topic cluster.",
    prompt:
      "List 10 long-tail keyword variations related to [main keyword]. Include search intent (informational, navigational, transactional) and target URL structure.",
    imagePrompt: "keyword cloud, connected nodes, blue and green, 1:1",
    excerpt: "Expand your SEO reach with related terms.",
    tags: ["seo", "keywords", "research"],
  },
  {
    id: "6",
    categoryId: "productivity",
    subcategoryId: "automation",
    title: "Zapier Workflow Blueprint",
    whatFor: "Plan multi-step automations between apps.",
    prompt:
      "Outline a Zapier workflow that connects [trigger app] to [action app] to achieve [goal]. Include all steps, data fields, and conditional logic.",
    imagePrompt: "app icons, connected arrows, clean, 16:9",
    excerpt: "Automate repetitive tasks with a clear blueprint.",
    tags: ["automation", "zapier", "workflow"],
  },
  {
    id: "7",
    categoryId: "sales",
    subcategoryId: "follow-up",
    title: "Re-Engagement Email Sequence",
    whatFor: "Win back cold leads with a value-driven sequence.",
    prompt:
      "Create a 3-email re-engagement sequence for cold leads who match [ideal customer profile]. Each email should offer unique value and a clear, low-pressure CTA.",
    imagePrompt: "returning arrow, email icon, blue, minimal, 4:3",
    excerpt: "Turn cold leads into warm prospects.",
    tags: ["email", "sales", "follow-up"],
  },
];
