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