import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.promptandgo.ai',
  output: 'static',
  integrations: [
    react(),
    tailwind({ applyBaseStyles: false }),
    sitemap({
      // The legacy app renders these routes as an empty React shell or
      // personal account content. They are not public landing pages.
      filter: (page) => !/^\/(?:account|admin|auth|checkout|membership|api|cart|dashboard|email-confirmed|history|referral|saved|search|settings|submit-prompt|ai-credits-exhausted|ai|ask-scout|certification|scout|templates|submit)(?:\/|$)/.test(new URL(page).pathname),
    }),
  ],
  build: {
    inlineStylesheets: 'auto',
  },
});
