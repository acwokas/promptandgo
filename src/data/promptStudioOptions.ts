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