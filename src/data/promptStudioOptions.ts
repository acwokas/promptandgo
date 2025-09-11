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
    { value: "photorealistic", label: "Photorealistic" },
    { value: "pop-art", label: "Pop Art" },
    { value: "anime", label: "Anime/Manga" },
    { value: "oil-painting", label: "Oil Painting" },
    { value: "watercolor", label: "Watercolor" },
    { value: "digital-art", label: "Digital Art" },
    { value: "minimalist", label: "Minimalist" },
    { value: "surreal", label: "Surreal" },
    { value: "cyberpunk", label: "Cyberpunk" },
    { value: "vintage", label: "Vintage" },
    { value: "art-deco", label: "Art Deco" },
    { value: "impressionist", label: "Impressionist" },
    { value: "abstract", label: "Abstract" },
    { value: "pixel-art", label: "Pixel Art" },
    { value: "sketch", label: "Pencil Sketch" },
    { value: "cartoon", label: "Cartoon" },
    { value: "noir", label: "Film Noir" },
    { value: "steampunk", label: "Steampunk" }
  ] as PromptOption[],

  formats: [
    { value: "instagram-story", label: "Instagram Story", aspectRatio: "9:16" },
    { value: "instagram-post", label: "Instagram Post", aspectRatio: "1:1" },
    { value: "facebook-ad", label: "Facebook Ad", aspectRatio: "1:1" },
    { value: "blog-header", label: "Blog Header", aspectRatio: "16:9" },
    { value: "youtube-thumbnail", label: "YouTube Thumbnail", aspectRatio: "16:9" },
    { value: "twitter-header", label: "Twitter Header", aspectRatio: "3:1" },
    { value: "linkedin-post", label: "LinkedIn Post", aspectRatio: "1:1" },
    { value: "website-banner", label: "Website Banner", aspectRatio: "5:2" },
    { value: "pinterest", label: "Pinterest Pin", aspectRatio: "2:3" },
    { value: "mobile-wallpaper", label: "Mobile Wallpaper", aspectRatio: "9:16" },
    { value: "desktop-wallpaper", label: "Desktop Wallpaper", aspectRatio: "16:9" },
    { value: "print-poster", label: "Print Poster", aspectRatio: "2:3" },
    { value: "business-card", label: "Business Card", aspectRatio: "85:55" },
    { value: "square", label: "Square", aspectRatio: "1:1" },
    { value: "landscape", label: "Landscape", aspectRatio: "4:3" },
    { value: "portrait", label: "Portrait", aspectRatio: "3:4" }
  ] as FormatOption[],

  colors: [
    { value: "monochrome", label: "Monochrome" },
    { value: "neon-glow", label: "Neon/Glow" },
    { value: "warm-tones", label: "Warm Tones" },
    { value: "cool-tones", label: "Cool Tones" },
    { value: "vibrant", label: "Vibrant" },
    { value: "muted", label: "Muted/Pastel" },
    { value: "earth-tones", label: "Earth Tones" },
    { value: "jewel-tones", label: "Jewel Tones" },
    { value: "black-white", label: "Black & White" },
    { value: "sepia", label: "Sepia" },
    { value: "complementary", label: "Complementary Colors" },
    { value: "analogous", label: "Analogous Colors" },
    { value: "triadic", label: "Triadic Colors" },
    { value: "gradient", label: "Gradient" },
    { value: "high-contrast", label: "High Contrast" },
    { value: "low-contrast", label: "Low Contrast" }
  ] as PromptOption[],

  effects: [
    { value: "motion-blur", label: "Motion Blur" },
    { value: "bokeh", label: "Bokeh" },
    { value: "watercolor-wash", label: "Watercolor Wash" },
    { value: "double-exposure", label: "Double Exposure" },
    { value: "light-leaks", label: "Light Leaks" },
    { value: "film-grain", label: "Film Grain" },
    { value: "vignette", label: "Vignette" },
    { value: "chromatic-aberration", label: "Chromatic Aberration" },
    { value: "lens-flare", label: "Lens Flare" },
    { value: "glow", label: "Glow Effect" },
    { value: "shadow-play", label: "Shadow Play" },
    { value: "reflection", label: "Reflection" },
    { value: "depth-of-field", label: "Depth of Field" },
    { value: "tilt-shift", label: "Tilt-Shift" },
    { value: "long-exposure", label: "Long Exposure" },
    { value: "particle-effects", label: "Particle Effects" },
    { value: "texture-overlay", label: "Texture Overlay" },
    { value: "atmospheric-haze", label: "Atmospheric Haze" }
  ] as PromptOption[],

  lenses: [
    { value: "macro-lens", label: "Macro Lens" },
    { value: "fisheye", label: "Fisheye" },
    { value: "wide-angle", label: "Wide Angle" },
    { value: "telephoto", label: "Telephoto" },
    { value: "portrait-lens", label: "Portrait Lens (85mm)" },
    { value: "standard-lens", label: "Standard Lens (50mm)" },
    { value: "ultra-wide", label: "Ultra Wide" },
    { value: "medium-format", label: "Medium Format" },
    { value: "large-format", label: "Large Format" },
    { value: "vintage-lens", label: "Vintage Lens" },
    { value: "anamorphic", label: "Anamorphic" },
    { value: "tilt-shift-lens", label: "Tilt-Shift Lens" },
    { value: "drone-camera", label: "Drone Camera" },
    { value: "smartphone", label: "Smartphone Camera" },
    { value: "film-camera", label: "Film Camera" },
    { value: "polaroid", label: "Polaroid" }
  ] as PromptOption[]
};