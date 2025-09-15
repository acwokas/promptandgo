export interface PromptOption {
  value: string;
  label: string;
  description?: string;
}

export interface FormatOption extends PromptOption {
  aspectRatio?: string;
}

export const imagePromptOptions = {
  styles: [
    { value: "3d-render", label: "3D Render / Pixar-style" },
    { value: "abstract", label: "Abstract" },
    { value: "anime", label: "Anime / Manga" },
    { value: "cinematic", label: "Cinematic" },
    { value: "concept-art", label: "Concept Art" },
    { value: "cyberpunk", label: "Cyberpunk / Futuristic" },
    { value: "digital-illustration", label: "Digital Illustration" },
    { value: "flat-design", label: "Flat Design / Vector" },
    { value: "impressionist", label: "Impressionist / Watercolour" },
    { value: "minimalist", label: "Minimalist" },
    { value: "noir", label: "Noir / Black-and-white" },
    { value: "photorealistic", label: "Photorealistic" },
    { value: "pop-art", label: "Pop Art" },
    { value: "realism", label: "Realism / Hyper-realistic" },
    { value: "retro-vintage", label: "Retro / Vintage / Film Grain" },
    { value: "surrealism", label: "Surrealism" }
  ] as PromptOption[],

  formats: [
    { value: "blog-header", label: "Blog header", aspectRatio: "16:9" },
    { value: "business-card", label: "Business card / Logo mockup", aspectRatio: "85:55" },
    { value: "desktop-wallpaper", label: "Desktop wallpaper", aspectRatio: "16:9" },
    { value: "facebook-ad", label: "Facebook ad", aspectRatio: "1:1" },
    { value: "instagram-post", label: "Instagram post", aspectRatio: "1:1" },
    { value: "instagram-story", label: "Instagram story", aspectRatio: "9:16" },
    { value: "linkedin-banner", label: "LinkedIn banner", aspectRatio: "4:1" },
    { value: "mobile-wallpaper", label: "Mobile wallpaper", aspectRatio: "9:16" },
    { value: "poster", label: "Poster (A3, A2, etc.)", aspectRatio: "2:3" },
    { value: "presentation-slide", label: "Presentation slide background", aspectRatio: "16:9" },
    { value: "tiktok-background", label: "TikTok background", aspectRatio: "9:16" },
    { value: "twitter-post", label: "Twitter/X post", aspectRatio: "16:9" },
    { value: "website-hero", label: "Website hero image", aspectRatio: "21:9" },
    { value: "youtube-thumbnail", label: "YouTube thumbnail", aspectRatio: "16:9" }
  ] as FormatOption[],

  colors: [
    { value: "bold-vibrant", label: "Bold & Vibrant (reds, blues, yellows)" },
    { value: "corporate-minimal", label: "Corporate / Minimal (navy, grey, white)" },
    { value: "dark-mode", label: "Dark mode (black with accents)" },
    { value: "earth-tones", label: "Earth Tones (brown, green, ochre)" },
    { value: "gradient", label: "Gradient (sunset tones, duotone)" },
    { value: "high-contrast", label: "High contrast / Colour blocking" },
    { value: "monochrome", label: "Monochrome (black/white/grey)" },
    { value: "neon-glow", label: "Neon / Glow" },
    { value: "pastels", label: "Pastels (soft peach, lavender, mint, etc.)" },
    { value: "rose-gold-metallics", label: "Rose-gold & metallics" }
  ] as PromptOption[],

  effects: [
    { value: "bokeh", label: "Bokeh" },
    { value: "double-exposure", label: "Double exposure" },
    { value: "glitch-distorted", label: "Glitch / Distorted" },
    { value: "glow-luminescent", label: "Glow / Luminescent" },
    { value: "grainy-film", label: "Grainy / Film effect" },
    { value: "holographic-iridescent", label: "Holographic / Iridescent" },
    { value: "light-leaks-flares", label: "Light leaks / Lens flares" },
    { value: "motion-blur", label: "Motion blur" },
    { value: "oil-paint-texture", label: "Oil paint texture" },
    { value: "pixelated-8bit", label: "Pixelated / 8-bit" },
    { value: "shadow-play-silhouettes", label: "Shadow play / Silhouettes" },
    { value: "smoke-fog-overlay", label: "Smoke / Fog overlay" },
    { value: "watercolour-wash", label: "Watercolour wash" }
  ] as PromptOption[],

  lenses: [
    { value: "aerial-drone", label: "Aerial / Drone shot" },
    { value: "cinematic-film", label: "Cinematic 35mm / 70mm film" },
    { value: "fisheye", label: "Fish-eye" },
    { value: "long-exposure", label: "Long exposure (light trails, night sky)" },
    { value: "macro", label: "Macro (extreme close-up)" },
    { value: "overhead-flatlay", label: "Overhead flat lay" },
    { value: "portrait", label: "Portrait (f/1.8 shallow depth of field, blurred background)" },
    { value: "street-photography", label: "Street photography style" },
    { value: "tilt-shift", label: "Tilt-shift (miniature look)" },
    { value: "wide-angle", label: "Wide angle (landscape feel)" }
  ] as PromptOption[]
};

export const eventPromptOptions = {
  eventTypes: [
    { value: "awards-ceremony", label: "Awards ceremony" },
    { value: "community-meetup", label: "Community meetup" },
    { value: "conference", label: "Conference" },
    { value: "fireside-chat", label: "Fireside chat" },
    { value: "fundraiser-gala", label: "Fundraiser / Gala" },
    { value: "hackathon", label: "Hackathon" },
    { value: "internal-town-hall", label: "Internal town hall" },
    { value: "networking-event", label: "Networking event" },
    { value: "panel-discussion", label: "Panel discussion" },
    { value: "press-conference", label: "Press conference" },
    { value: "product-launch", label: "Product launch" },
    { value: "recruitment-fair", label: "Recruitment fair" },
    { value: "seminar", label: "Seminar" },
    { value: "summit", label: "Summit" },
    { value: "team-offsite", label: "Team offsite" },
    { value: "trade-show-expo", label: "Trade show / Expo" },
    { value: "webinar", label: "Webinar" },
    { value: "workshop", label: "Workshop" }
  ] as PromptOption[],

  eventFormats: [
    { value: "hybrid", label: "Hybrid" },
    { value: "in-person", label: "In-person" },
    { value: "large-scale", label: "Large-scale" },
    { value: "on-demand", label: "On-demand (pre-recorded)" },
    { value: "small-group", label: "Small group" },
    { value: "virtual", label: "Virtual" }
  ] as PromptOption[],

  audienceTypes: [
    { value: "community-members", label: "Community members" },
    { value: "customers-clients", label: "Customers / clients" },
    { value: "employees", label: "Employees" },
    { value: "entrepreneurs", label: "Entrepreneurs" },
    { value: "executives-csuite", label: "Executives / C-suite" },
    { value: "families", label: "Families" },
    { value: "industry-professionals", label: "Industry professionals" },
    { value: "investors", label: "Investors" },
    { value: "media-press", label: "Media & press" },
    { value: "parents", label: "Parents" },
    { value: "students", label: "Students" }
  ] as PromptOption[],

  audienceSizes: [
    { value: "small", label: "Small (under 50)" },
    { value: "medium", label: "Medium (50-200)" },
    { value: "large", label: "Large (200-1000)" },
    { value: "massive", label: "Massive (1000+)" }
  ] as PromptOption[],

  tones: [
    { value: "community-driven", label: "Community-driven & welcoming" },
    { value: "disruptive-bold", label: "Disruptive & bold" },
    { value: "exclusive-premium", label: "Exclusive & premium" },
    { value: "inspirational", label: "Inspirational & motivational" },
    { value: "playful", label: "Playful & entertaining" },
    { value: "professional", label: "Professional & formal" },
    { value: "relaxed", label: "Relaxed & casual" }
  ] as PromptOption[],

  themes: [
    { value: "celebration", label: "Celebration & recognition" },
    { value: "culture-community", label: "Culture & community building" },
    { value: "education", label: "Education & learning" },
    { value: "fundraising", label: "Fundraising & charity" },
    { value: "innovation", label: "Innovation & future trends" },
    { value: "knowledge-sharing", label: "Knowledge sharing" },
    { value: "networking", label: "Networking & connections" },
    { value: "product-showcase", label: "Product showcase / demo" },
    { value: "recruitment", label: "Recruitment & careers" },
    { value: "thought-leadership", label: "Thought leadership" }
  ] as PromptOption[],

  venueTypes: [
    { value: "conference-centre", label: "Conference centre" },
    { value: "hotel-ballroom", label: "Hotel ballroom" },
    { value: "hybrid-studio", label: "Hybrid studio setup" },
    { value: "hybrid-venue", label: "Hybrid (In-person and Virtual)" },
    { value: "office-coworking", label: "Office / co-working space" },
    { value: "outdoor-venue", label: "Outdoor venue" },
    { value: "quirky-venue", label: "Quirky (e.g. Church, Museum)" },
    { value: "restaurant-cafe", label: "Restaurant / café" },
    { value: "university-campus", label: "University / campus" },
    { value: "virtual-platform", label: "Virtual platform (Zoom, TEAMS, Google, etc)" }
  ] as PromptOption[],

  geoLocations: [
    { value: "africa", label: "Africa" },
    { value: "apac", label: "APAC" },
    { value: "asia", label: "Asia" },
    { value: "europe", label: "Europe" },
    { value: "global", label: "Global" },
    { value: "india", label: "India" },
    { value: "latin-america", label: "Latin America" },
    { value: "middle-east", label: "Middle East" },
    { value: "north-america", label: "North America" },
    { value: "single-country", label: "Single country" },
    { value: "southeast-asia", label: "Southeast Asia" }
  ] as PromptOption[],

  engagementFormats: [
    { value: "arts-culture", label: "Arts & Culture" },
    { value: "case-study", label: "Case study presentation" },
    { value: "entertainment-act", label: "Entertainment act" },
    { value: "fireside-chat", label: "Fireside chat" },
    { value: "interactive-poll", label: "Interactive poll / quiz" },
    { value: "keynote-speech", label: "Keynote speech" },
    { value: "live-demo", label: "Live demo" },
    { value: "media-launch", label: "Media launch" },
    { value: "networking-session", label: "Networking session" },
    { value: "panel-qa", label: "Panel Q&A" },
    { value: "party", label: "Party" },
    { value: "product-launch", label: "Product Launch" },
    { value: "roundtable", label: "Roundtable discussion" },
    { value: "virtual-chat", label: "Virtual chat rooms" },
    { value: "workshop-breakout", label: "Workshop breakout" }
  ] as PromptOption[],

  ctaStyles: [
    { value: "apply-attend", label: "Apply to attend" },
    { value: "be-part", label: "Be part of the conversation" },
    { value: "dont-miss", label: "Don't miss out" },
    { value: "join-waitlist", label: "Join the waitlist" },
    { value: "limited-spots", label: "Limited spots available" },
    { value: "register-now", label: "Register now" },
    { value: "save-seat", label: "Save your seat" },
    { value: "sign-up-free", label: "Sign up free" }
  ] as PromptOption[],

  followUpOutcomes: [
    { value: "event-recap", label: "Event recap article" },
    { value: "exclusive-resource", label: "Exclusive resource (slides, white paper)" },
    { value: "highlight-video", label: "Highlight video" },
    { value: "key-takeaways", label: "Key takeaways summary" },
    { value: "networking-connections", label: "Networking connections" },
    { value: "on-demand-replay", label: "On-demand replay link" },
    { value: "photo-gallery", label: "Photo gallery" },
    { value: "post-event-survey", label: "Post-event survey" }
  ] as PromptOption[]
};

// CTA Prompt Options
export const ctaPromptOptions = {
  platforms: [
    { value: "facebook", label: "Facebook" },
    { value: "instagram", label: "Instagram" },
    { value: "linkedin", label: "LinkedIn" },
    { value: "pinterest", label: "Pinterest" },
    { value: "snapchat", label: "Snapchat" },
    { value: "threads", label: "Threads" },
    { value: "tiktok", label: "TikTok" },
    { value: "twitter-x", label: "Twitter / X" },
    { value: "youtube", label: "YouTube" }
  ] as PromptOption[],

  postFormats: [
    { value: "carousel-multi-image", label: "Carousel / multi-image" },
    { value: "gif-animation", label: "GIF / animation" },
    { value: "infographic", label: "Infographic" },
    { value: "live-stream", label: "Live stream" },
    { value: "meme-humorous", label: "Meme / humorous post" },
    { value: "poll-survey", label: "Poll / survey" },
    { value: "single-image", label: "Single image post" },
    { value: "story-ephemeral", label: "Story / ephemeral" },
    { value: "text-only", label: "Text-only update" },
    { value: "video-long-form", label: "Video (long-form)" },
    { value: "video-short-form", label: "Video (short-form)" }
  ] as PromptOption[],

  contentTypes: [
    { value: "behind-scenes", label: "Behind the scenes" },
    { value: "case-study", label: "Case study / success story" },
    { value: "customer-testimonial", label: "Customer testimonial" },
    { value: "educational-howto", label: "Educational / how-to" },
    { value: "event-promotion", label: "Event promotion" },
    { value: "inspirational-motivational", label: "Inspirational / motivational" },
    { value: "interactive-quiz", label: "Interactive / quiz" },
    { value: "news-update", label: "News update" },
    { value: "product-showcase", label: "Product showcase" },
    { value: "team-spotlight", label: "Team spotlight" },
    { value: "thought-leadership", label: "Thought leadership" },
    { value: "trend-challenge", label: "Trend / challenge" },
    { value: "user-generated", label: "User-generated content" }
  ] as PromptOption[],

  toneOfVoice: [
    { value: "bold-disruptive", label: "Bold & disruptive" },
    { value: "empathetic-supportive", label: "Empathetic & supportive" },
    { value: "friendly-approachable", label: "Friendly & approachable" },
    { value: "inspirational-uplifting", label: "Inspirational & uplifting" },
    { value: "minimal-straightforward", label: "Minimal & straightforward" },
    { value: "playful-witty", label: "Playful & witty" },
    { value: "professional-authoritative", label: "Professional & authoritative" }
  ] as PromptOption[],

  audienceSegmentation: [
    { value: "boomers", label: "Boomers (56+)" },
    { value: "entrepreneurs", label: "Entrepreneurs" },
    { value: "executives", label: "Executives / decision makers" },
    { value: "gen-x", label: "Gen X (41–55)" },
    { value: "gen-z", label: "Gen Z (18–25)" },
    { value: "millennials", label: "Millennials (26–40)" },
    { value: "parents", label: "Parents" },
    { value: "students", label: "Students" },
    { value: "young-professionals", label: "Young professionals" }
  ] as PromptOption[],

  geoLocations: [
    { value: "africa", label: "Africa" },
    { value: "apac", label: "APAC" },
    { value: "asia", label: "Asia" },
    { value: "europe", label: "Europe" },
    { value: "global", label: "Global" },
    { value: "india", label: "India" },
    { value: "latin-america", label: "Latin America" },
    { value: "middle-east", label: "Middle East" },
    { value: "north-america", label: "North America" },
    { value: "north-asia", label: "North Asia" },
    { value: "southeast-asia", label: "Southeast Asia" }
  ] as PromptOption[],

  engagementGoals: [
    { value: "awareness", label: "Awareness (reach new audience)" },
    { value: "community-building", label: "Community building (discussion, loyalty)" },
    { value: "conversion", label: "Conversion (sales, purchase)" },
    { value: "employer-branding", label: "Employer branding (hiring, culture)" },
    { value: "engagement", label: "Engagement (likes, comments, shares)" },
    { value: "lead-generation", label: "Lead generation (signups, downloads)" },
    { value: "traffic", label: "Traffic (drive to website)" }
  ] as PromptOption[],

  visualStyles: [
    { value: "bold-vibrant", label: "Bold & vibrant" },
    { value: "cinematic", label: "Cinematic" },
    { value: "corporate-professional", label: "Corporate / professional" },
    { value: "illustrated-cartoon", label: "Illustrated / cartoon" },
    { value: "memes-pop-culture", label: "Memes / pop culture" },
    { value: "minimalist-clean", label: "Minimalist / clean" },
    { value: "pastel-soft", label: "Pastel & soft" },
    { value: "retro-vintage", label: "Retro / vintage" },
    { value: "user-generated-authentic", label: "User-generated raw / authentic" }
  ] as PromptOption[],

  ctaStyles: [
    { value: "aspirational", label: "Aspirational (Be part of it)" },
    { value: "conversational", label: "Conversational (Let's chat, Tell us…)" },
    { value: "curious", label: "Curious (Did you know…?)" },
    { value: "direct", label: "Direct (Shop now, Sign up)" },
    { value: "engagement-based", label: "Engagement-based (Comment below, Tag a friend)" },
    { value: "urgent", label: "Urgent (Don't miss out)" }
  ] as PromptOption[],

  hashtagStrategies: [
    { value: "branded-hashtag", label: "Branded hashtag" },
    { value: "campaign-specific", label: "Campaign-specific hashtag" },
    { value: "community-hashtag", label: "Community hashtag" },
    { value: "event-hashtag", label: "Event hashtag" },
    { value: "maximal-hashtags", label: "Maximal hashtags (10–20)" },
    { value: "minimal-hashtags", label: "Minimal hashtags (1–3)" },
    { value: "niche-industry", label: "Niche industry hashtag" },
    { value: "trending-hashtag", label: "Trending hashtag" }
  ] as PromptOption[],

  postingTimeframes: [
    { value: "afternoon", label: "Afternoon" },
    { value: "evening", label: "Evening" },
    { value: "late-night", label: "Late night" },
    { value: "lunchtime", label: "Lunchtime" },
    { value: "morning", label: "Morning" },
    { value: "weekday", label: "Weekday" },
    { value: "weekend", label: "Weekend" }
  ] as PromptOption[],

  powerWords: [
    { value: "bold", label: "Bold" },
    { value: "create", label: "Create" },
    { value: "culture", label: "Culture" },
    { value: "future", label: "Future" },
    { value: "growth", label: "Growth" },
    { value: "human", label: "Human" },
    { value: "impact", label: "Impact" },
    { value: "momentum", label: "Momentum" },
    { value: "spark", label: "Spark" },
    { value: "together", label: "Together" },
    { value: "trust", label: "Trust" },
    { value: "vision", label: "Vision" }
  ] as PromptOption[]
};

// Blog Article Prompt Options
export const blogPromptOptions = {
  targetAudiences: [
    { value: "marketers", label: "Marketers" },
    { value: "developers", label: "Developers" },
    { value: "students", label: "Students" },
    { value: "executives", label: "Executives" },
    { value: "entrepreneurs", label: "Entrepreneurs" },
    { value: "general", label: "General Public" }
  ] as PromptOption[],
  contentGoals: [
    { value: "awareness", label: "Awareness" },
    { value: "education", label: "Education" },
    { value: "thought-leadership", label: "Thought Leadership" },
    { value: "lead-generation", label: "Lead Generation" },
    { value: "seo-ranking", label: "SEO Ranking" }
  ] as PromptOption[],
  articleTypes: [
    { value: "how-to", label: "How-to Guide" },
    { value: "listicle", label: "Listicle" },
    { value: "case-study", label: "Case Study" },
    { value: "opinion", label: "Opinion" },
    { value: "news-analysis", label: "News Analysis" },
    { value: "explainer", label: "Explainer" }
  ] as PromptOption[],
  toneOfVoice: [
    { value: "conversational", label: "Conversational" },
    { value: "professional", label: "Professional" },
    { value: "educational", label: "Educational" },
    { value: "persuasive", label: "Persuasive" },
    { value: "humorous", label: "Humorous" }
  ] as PromptOption[],
  lengthFormats: [
    { value: "short", label: "Short-form (500 words)" },
    { value: "medium", label: "Medium (1,000 words)" },
    { value: "long", label: "Long-form (2,000+ words)" }
  ] as PromptOption[]
};

// Ad Copy Prompt Options  
// Job Application Prompt Options
export const jobApplicationPromptOptions = {
  applicationTypes: [
    { value: "cv-tailoring", label: "CV Tailoring" },
    { value: "cover-letter", label: "Cover Letter" },
    { value: "linkedin-outreach", label: "LinkedIn Outreach" },
    { value: "interview-qa", label: "Interview Q&A" },
    { value: "portfolio-description", label: "Portfolio Description" }
  ] as PromptOption[],

  toneOfVoice: [
    { value: "professional", label: "Professional" },
    { value: "personalised", label: "Personalised" },
    { value: "bold", label: "Bold" },
    { value: "humble", label: "Humble" },
    { value: "confident", label: "Confident" }
  ] as PromptOption[]
};

// Learning & Study Prompt Options
export const learningStudyPromptOptions = {
  targetLevels: [
    { value: "beginner", label: "Beginner" },
    { value: "intermediate", label: "Intermediate" },
    { value: "advanced", label: "Advanced" },
    { value: "expert", label: "Expert" }
  ] as PromptOption[],

  learningFormats: [
    { value: "summary", label: "Summary" },
    { value: "flashcards", label: "Flashcards" },
    { value: "step-by-step", label: "Step-by-step Explanation" },
    { value: "qa-practice", label: "Q&A Practice" },
    { value: "case-studies", label: "Case Studies" }
  ] as PromptOption[],

  toneOfVoice: [
    { value: "teacherly", label: "Teacherly" },
    { value: "friendly", label: "Friendly" },
    { value: "academic", label: "Academic" },
    { value: "playful", label: "Playful" },
    { value: "storytelling", label: "Storytelling" }
  ] as PromptOption[]
};

// Business Strategy Prompt Options
export const businessStrategyPromptOptions = {
  businessTypes: [
    { value: "startup", label: "Startup" },
    { value: "sme", label: "SME" },
    { value: "enterprise", label: "Enterprise" },
    { value: "non-profit", label: "Non-profit" },
    { value: "government-agency", label: "Government Agency" }
  ] as PromptOption[],

  focusAreas: [
    { value: "growth", label: "Growth" },
    { value: "operations", label: "Operations" },
    { value: "marketing", label: "Marketing" },
    { value: "finance", label: "Finance" },
    { value: "product", label: "Product" },
    { value: "partnerships", label: "Partnerships" }
  ] as PromptOption[],

  frameworks: [
    { value: "swot", label: "SWOT" },
    { value: "porter-five-forces", label: "Porter's Five Forces" },
    { value: "pestle", label: "PESTLE" },
    { value: "business-model-canvas", label: "Business Model Canvas" },
    { value: "custom", label: "Custom" }
  ] as PromptOption[],

  strategyHorizons: [
    { value: "short-term", label: "Short-term (0–6 months)" },
    { value: "mid-term", label: "Mid-term (1–3 years)" },
    { value: "long-term", label: "Long-term (3–5+ years)" }
  ] as PromptOption[],

  outputFormats: [
    { value: "report", label: "Report" },
    { value: "executive-summary", label: "Executive Summary" },
    { value: "comparison-matrix", label: "Comparison Matrix" },
    { value: "roadmap", label: "Roadmap" },
    { value: "pitch-slide-outline", label: "Pitch Slide Outline" }
  ] as PromptOption[]
};

// Storytelling Prompt Options
export const storytellingPromptOptions = {
  storyGenres: [
    { value: "sci-fi", label: "Sci-fi" },
    { value: "fantasy", label: "Fantasy" },
    { value: "mystery", label: "Mystery" },
    { value: "romance", label: "Romance" },
    { value: "drama", label: "Drama" },
    { value: "comedy", label: "Comedy" },
    { value: "non-fiction", label: "Non-fiction" }
  ] as PromptOption[],

  settings: [
    { value: "historical", label: "Historical" },
    { value: "futuristic", label: "Futuristic" },
    { value: "urban", label: "Urban" },
    { value: "mythical", label: "Mythical" },
    { value: "dystopian", label: "Dystopian" },
    { value: "realistic", label: "Realistic" }
  ] as PromptOption[],

  storyLengths: [
    { value: "short-story", label: "Short Story" },
    { value: "chapter", label: "Chapter" },
    { value: "novel-outline", label: "Novel Outline" },
    { value: "script", label: "Script" },
    { value: "pitch-logline", label: "Pitch/Logline" }
  ] as PromptOption[],

  narrativeStyles: [
    { value: "first-person", label: "First-person" },
    { value: "third-person", label: "Third-person" },
    { value: "dialogue-driven", label: "Dialogue-driven" },
    { value: "epistolary", label: "Epistolary" },
    { value: "scripted", label: "Scripted" }
  ] as PromptOption[]
};

// Productivity & Workflow Prompt Options
export const productivityWorkflowPromptOptions = {
  taskTypes: [
    { value: "planning", label: "Planning" },
    { value: "prioritisation", label: "Prioritisation" },
    { value: "brainstorming", label: "Brainstorming" },
    { value: "decision-making", label: "Decision-making" },
    { value: "tracking", label: "Tracking" }
  ] as PromptOption[],

  productivityFrameworks: [
    { value: "eisenhower-matrix", label: "Eisenhower Matrix" },
    { value: "okrs", label: "OKRs" },
    { value: "agile-sprint", label: "Agile Sprint Plan" },
    { value: "gtd", label: "GTD (Getting Things Done)" },
    { value: "kanban", label: "Kanban" },
    { value: "custom", label: "Custom" }
  ] as PromptOption[],

  outputFormats: [
    { value: "checklist", label: "Checklist" },
    { value: "calendar-plan", label: "Calendar Plan" },
    { value: "table", label: "Table" },
    { value: "mindmap-outline", label: "Mindmap Outline" },
    { value: "flowchart", label: "Flowchart" },
    { value: "daily-schedule", label: "Daily Schedule" }
  ] as PromptOption[],

  toneOfOutput: [
    { value: "structured", label: "Structured" },
    { value: "motivational", label: "Motivational" },
    { value: "minimalist", label: "Minimalist" },
    { value: "detailed", label: "Detailed" },
    { value: "creative", label: "Creative" }
  ] as PromptOption[],

  timeHorizons: [
    { value: "today", label: "Today" },
    { value: "this-week", label: "This Week" },
    { value: "this-month", label: "This Month" },
    { value: "this-quarter", label: "This Quarter" }
  ] as PromptOption[]
};

export const adCopyPromptOptions = {
  platforms: [
    { value: "google-ads", label: "Google Ads" },
    { value: "meta-ads", label: "Meta Ads" },
    { value: "linkedin-ads", label: "LinkedIn Ads" },
    { value: "tiktok-ads", label: "TikTok Ads" },
    { value: "display-banner", label: "Display Banner" }
  ] as PromptOption[],
  adFormats: [
    { value: "headline", label: "Headline" },
    { value: "text-ad", label: "Text Ad" },
    { value: "carousel", label: "Carousel" },
    { value: "video-script", label: "Video Script" },
    { value: "display-copy", label: "Display Copy" }
  ] as PromptOption[],
  audienceTypes: [
    { value: "b2b-professionals", label: "B2B Professionals" },
    { value: "gen-z", label: "Gen Z" },
    { value: "parents", label: "Parents" },
    { value: "tech-enthusiasts", label: "Tech Enthusiasts" },
    { value: "luxury-buyers", label: "Luxury Buyers" }
  ] as PromptOption[],
  ctaFocus: [
    { value: "buy-now", label: "Buy Now" },
    { value: "sign-up", label: "Sign Up" },
    { value: "learn-more", label: "Learn More" },
    { value: "book-demo", label: "Book Demo" },
    { value: "download", label: "Download" }
  ] as PromptOption[],
  toneOfVoice: [
    { value: "urgent", label: "Urgent" },
    { value: "inspirational", label: "Inspirational" },
    { value: "educational", label: "Educational" },
    { value: "casual", label: "Casual" },
    { value: "bold", label: "Bold" }
  ] as PromptOption[],
  wordLengths: [
    { value: "short", label: "Short (under 30 words)" },
    { value: "medium", label: "Medium" },
    { value: "long", label: "Long-form persuasive" }
  ] as PromptOption[]
};

// Sales Email Prompt Options
export const salesEmailPromptOptions = {
  emailPurposes: [
    { value: "cold-outreach", label: "Cold Outreach" },
    { value: "follow-up", label: "Follow-up" },
    { value: "demo-invite", label: "Demo Invite" },
    { value: "post-meeting-recap", label: "Post-Meeting Recap" },
    { value: "proposal-send", label: "Proposal Send" }
  ] as PromptOption[],
  recipientRoles: [
    { value: "ceo", label: "CEO" },
    { value: "marketing-director", label: "Marketing Director" },
    { value: "procurement", label: "Procurement" },
    { value: "investor", label: "Investor" },
    { value: "partner", label: "Partner" }
  ] as PromptOption[],
  toneOfVoice: [
    { value: "warm-personal", label: "Warm/Personal" },
    { value: "direct-concise", label: "Direct/Concise" },
    { value: "persuasive", label: "Persuasive" },
    { value: "formal", label: "Formal" }
  ] as PromptOption[],
  ctaStyles: [
    { value: "book-call", label: "Book a call" },
    { value: "reply-email", label: "Reply to email" },
    { value: "download-resource", label: "Download resource" },
    { value: "register", label: "Register" }
  ] as PromptOption[],
  followUpPlans: [
    { value: "2-day", label: "2-day reminder" },
    { value: "1-week", label: "1-week later" },
    { value: "sequence-3", label: "Sequence of 3 emails" }
  ] as PromptOption[]
};

// Video Script Prompt Options
export const videoScriptPromptOptions = {
  videoPurposes: [
    { value: "product-explainer", label: "Product Explainer" },
    { value: "brand-story", label: "Brand Story" },
    { value: "testimonial", label: "Testimonial" },
    { value: "tutorial", label: "Tutorial" },
    { value: "event-promo", label: "Event Promo" }
  ] as PromptOption[],
  videoLengths: [
    { value: "15s", label: "15s" },
    { value: "30s", label: "30s" },
    { value: "60s", label: "60s" },
    { value: "2-3min", label: "2–3 min" },
    { value: "long-form", label: "Long-form YouTube" }
  ] as PromptOption[],
  audiences: [
    { value: "gen-z", label: "Gen Z" },
    { value: "professionals", label: "Professionals" },
    { value: "parents", label: "Parents" },
    { value: "global", label: "Global" },
    { value: "local-market", label: "Local Market" }
  ] as PromptOption[],
  scriptStyles: [
    { value: "storytelling", label: "Storytelling" },
    { value: "direct-pitch", label: "Direct Pitch" },
    { value: "conversational", label: "Conversational" },
    { value: "humorous", label: "Humorous" },
    { value: "inspirational", label: "Inspirational" }
  ] as PromptOption[],
  ctaOptions: [
    { value: "subscribe", label: "Subscribe" },
    { value: "visit-website", label: "Visit Website" },
    { value: "sign-up", label: "Sign Up" },
    { value: "buy-now", label: "Buy Now" },
    { value: "share", label: "Share" }
  ] as PromptOption[]
};

// Research Prompt Options
export const researchPromptOptions = {
  researchGoals: [
    { value: "market-insights", label: "Market Insights" },
    { value: "competitive-analysis", label: "Competitive Analysis" },
    { value: "trend-forecast", label: "Trend Forecast" },
    { value: "consumer-behaviour", label: "Consumer Behaviour" },
    { value: "policy-implications", label: "Policy Implications" }
  ] as PromptOption[],
  dataScopes: [
    { value: "global", label: "Global" },
    { value: "regional", label: "Regional" },
    { value: "country-specific", label: "Country-specific" }
  ] as PromptOption[],
  outputFormats: [
    { value: "report", label: "Report" },
    { value: "executive-summary", label: "Executive Summary" },
    { value: "comparison-matrix", label: "Comparison Matrix" },
    { value: "swot", label: "SWOT" },
    { value: "infographic-outline", label: "Infographic Outline" }
  ] as PromptOption[],
  timeHorizons: [
    { value: "current", label: "Current (0–1 year)" },
    { value: "short-term", label: "Short-term (1–3 years)" },
    { value: "long-term", label: "Long-term (3–10 years)" }
  ] as PromptOption[],
  depthLevels: [
    { value: "quick-overview", label: "Quick overview" },
    { value: "moderate-detail", label: "Moderate detail" },
    { value: "deep-dive", label: "In-depth deep dive" }
  ] as PromptOption[]
};