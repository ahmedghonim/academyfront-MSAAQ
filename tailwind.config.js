import { abjad } from "@msaaqcom/abjad/dist/theme";

/** @type {import("tailwindcss").Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@msaaqcom/abjad/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    container: {
      screens: {
        sm: "540px",
        md: "720px",
        lg: "960px",
        xl: "1140px",
        "2xl": "1320px"
      }
    },
    extend: {
      screens: {
        xs: "480px"
      },
      typography: {
        "custom-blockquote": {
          css: {
            blockquote: {
              background: "hsl(var(--abjad-info-50))",
              fontStyle: "normal !important",
              textAlign: "start",
              borderRadius: "8px",
              border: 0,
              position: "relative"
            },
            "[dir='rtl'] blockquote": {
              padding: "24px 34px 24px 24px"
            },
            "[dir='ltr'] blockquote": {
              padding: "24px 24px 24px 34px"
            },
            "blockquote::before": {
              content: '""',
              position: "absolute",
              top: "24px",
              bottom: "24px",
              width: "2px",
              backgroundColor: "hsl(var(--abjad-info))"
            },
            "[dir='rtl'] blockquote::before": {
              right: "0",
              marginRight: "24px"
            },
            "[dir='ltr'] blockquote::before": {
              left: "0",
              marginLeft: "24px"
            },
            "blockquote::after": {
              content: 'url("/images/double-quotes.svg")',
              position: "absolute",
              top: "-16px",
              bottom: "0"
            },
            "[dir='rtl'] blockquote::after": {
              left: "-24px"
            },
            "[dir='ltr'] blockquote::after": {
              right: "-24px",
              transform: "rotateY(180deg)"
            },
            "blockquote p::before": { content: "none !important" },
            "blockquote p::after": { content: "none !important" }
          }
        }
      }
    },
    typography: {
      currentColor: {
        css: {
          "--tw-prose-body": "currentColor",
          "--tw-prose-headings": "currentColor",
          "--tw-prose-lead": "currentColor",
          "--tw-prose-links": "currentColor",
          "--tw-prose-bold": "currentColor",
          "--tw-prose-counters": "currentColor",
          "--tw-prose-bullets": "currentColor",
          "--tw-prose-hr": "currentColor",
          "--tw-prose-quotes": "currentColor",
          "--tw-prose-quote-borders": "currentColor",
          "--tw-prose-captions": "currentColor",
          "--tw-prose-code": "currentColor",
          "--tw-prose-pre-code": "currentColor",
          "--tw-prose-pre-bg": "currentColor",
          "--tw-prose-th-borders": "currentColor",
          "--tw-prose-td-borders": "currentColor",
          "--tw-prose-invert-body": "currentColor",
          "--tw-prose-invert-headings": "currentColor",
          "--tw-prose-invert-lead": "currentColor",
          "--tw-prose-invert-links": "currentColor",
          "--tw-prose-invert-bold": "currentColor",
          "--tw-prose-invert-counters": "currentColor",
          "--tw-prose-invert-bullets": "currentColor",
          "--tw-prose-invert-hr": "currentColor",
          "--tw-prose-invert-quotes": "currentColor",
          "--tw-prose-invert-quote-borders": "currentColor",
          "--tw-prose-invert-captions": "currentColor",
          "--tw-prose-invert-code": "currentColor",
          "--tw-prose-invert-pre-code": "currentColor",
          "--tw-prose-invert-pre-bg": "currentColor",
          "--tw-prose-invert-th-borders": "currentColor",
          "--tw-prose-invert-td-borders": "currentColor"
        }
      }
    }
  },
  plugins: [
    abjad({
      themes: ({ light, dark }) => ({
        light: light({}),
        dark: dark({}),
        custom: {}
      })
    }),
    require("@tailwindcss/typography"),
    require("@tailwindcss/aspect-ratio")
  ]
};
