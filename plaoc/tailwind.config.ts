import { Config } from "@sveltejs/kit";

export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  ux: {
    themes: {
      "light": {
        "color-scheme": "light",
        "primary": "hsl(0 0% 5.098%)",
        "secondary": "hsl(0 1.9608% 10%)",
        "accent": "hsl(0 0% 14.902%)",
        "neutral": "hsl(0 0% 0%)",
        "info": "hsl(186.3996 64.5332% 61.9566%)",
        "success": "hsl(156.3531 98.7858% 70.4206%)",
        "warning": "hsl(40.5761 100% 70.509%)",
        "danger": "hsl(7.4376 100% 75.3917%)",
        "surface-100": "hsl(180 100% 100%)",
        "surface-200": "hsl(0 0% 94.902%)",
        "surface-300": "hsl(0 1.9608% 90%)"
      },
      "dark": {
        "color-scheme": "dark",
        "primary": "hsl(198.4375 93.2039% 59.6078%)",
        "secondary": "hsl(234.4538 89.4737% 73.9216%)",
        "accent": "hsl(328.855 85.6209% 70%)",
        "neutral": "hsl(217.2414 32.5843% 17.451%)",
        "info": "hsl(198.4615 90.2041% 48.0392%)",
        "success": "hsl(172.4551 66.0079% 50.3922%)",
        "warning": "hsl(40.6098 88.172% 63.5294%)",
        "danger": "hsl(350.9353 94.5578% 71.1765%)",
        "surface-100": "hsl(222.2222 47.3684% 11.1765%)"
      }
    },
  },
  plugins: [require("@tailwindcss/typography"),require('svelte-ux/plugins/tailwind.cjs')]
} as Config;
