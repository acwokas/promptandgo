import { Mail, BarChart3, MessageSquare, HeadphonesIcon, ShoppingBag, Users, Code2, Feather } from "lucide-react";

const TEMPLATES = [
  {
    id: "business-email",
    icon: Mail,
    label: "Business Email",
    desc: "Formal Asian business context",
    gradient: "from-blue-500 to-cyan-500",
    prompt: "Write a professional follow-up email to a potential business partner in Singapore after an initial meeting. Include appropriate level of formality, mention the key discussion points, and propose next steps.",
  },
  {
    id: "market-research",
    icon: BarChart3,
    label: "Market Research",
    desc: "APAC market analysis",
    gradient: "from-violet-500 to-purple-500",
    prompt: "Conduct a market analysis for launching a new SaaS product in the Southeast Asian market. Cover market size, key competitors, pricing strategies, and cultural considerations for Singapore, Indonesia, and Vietnam.",
  },
  {
    id: "social-media",
    icon: MessageSquare,
    label: "Social Media Post",
    desc: "Multilingual content",
    gradient: "from-pink-500 to-rose-500",
    prompt: "Create a social media post announcing a new product launch. The post should work across Instagram, LinkedIn, and LINE. Include hashtags and adapt the tone for a young professional audience in Asia.",
  },
  {
    id: "customer-support",
    icon: HeadphonesIcon,
    label: "Customer Support",
    desc: "Polite Asian CS style",
    gradient: "from-amber-500 to-orange-500",
    prompt: "Write a customer support response to a complaint about a delayed delivery. Use a polite and empathetic tone appropriate for Asian customer service standards. Include an apology, explanation, and resolution offer.",
  },
  {
    id: "product-description",
    icon: ShoppingBag,
    label: "Product Description",
    desc: "E-commerce optimized",
    gradient: "from-emerald-500 to-green-500",
    prompt: "Write a product description for a premium skincare serum to be listed on Shopee and Lazada. Include key ingredients, benefits, usage instructions, and SEO-friendly keywords for the Southeast Asian market.",
  },
  {
    id: "meeting-summary",
    icon: Users,
    label: "Meeting Summary",
    desc: "Corporate Asia format",
    gradient: "from-sky-500 to-blue-500",
    prompt: "Summarize the key decisions, action items, and deadlines from a cross-functional team meeting. Format it for distribution to stakeholders across multiple Asian offices. Include a follow-up timeline.",
  },
  {
    id: "code-review",
    icon: Code2,
    label: "Code Review",
    desc: "Technical review",
    gradient: "from-slate-500 to-zinc-500",
    prompt: "Review this code for performance issues, security vulnerabilities, and best practice violations. Provide specific suggestions with code examples. Focus on scalability and maintainability.",
  },
  {
    id: "creative-writing",
    icon: Feather,
    label: "Creative Writing",
    desc: "Culturally aware",
    gradient: "from-fuchsia-500 to-pink-500",
    prompt: "Write a short brand story for a modern tea company that bridges traditional Asian tea culture with contemporary lifestyle. The narrative should resonate with millennials across East and Southeast Asia.",
  },
];

interface TemplateQuickStartProps {
  onSelect: (prompt: string) => void;
}

export const TemplateQuickStart = ({ onSelect }: TemplateQuickStartProps) => {
  return (
    <div>
      <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
        <Feather className="h-4 w-4 text-primary" />
        Start from a template
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {TEMPLATES.map((t) => (
          <button
            key={t.id}
            onClick={() => onSelect(t.prompt)}
            className="group flex flex-col items-start gap-2 p-3 rounded-xl border border-border/50 bg-card hover:border-primary/40 hover:shadow-md transition-all duration-200 text-left"
          >
            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${t.gradient} flex items-center justify-center group-hover:scale-110 transition-transform`}>
              <t.icon className="h-4 w-4 text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold leading-tight">{t.label}</p>
              <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">{t.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
