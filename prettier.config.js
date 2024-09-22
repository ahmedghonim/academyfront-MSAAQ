// prettier.config.js
const tailwindPlugin = require("prettier-plugin-tailwindcss");
const sortImportsPlugin = require("@trivago/prettier-plugin-sort-imports");

module.exports = {
  singleQuote: false,
  bracketSpacing: true,
  semi: true,
  trailingComma: "none",
  printWidth: 120,
  tabWidth: 2,
  singleAttributePerLine: true,
  bracketSameLine: false,
  jsxSingleQuote: false,
  importOrder: [
    "^(react/(.*)$)|^(react$)",
    "^(next/(.*)$)|^(next$)",
    "<THIRD_PARTY_MODULES>",
    "^@/",
    "^@/components/(.*)$|^components/(.*)$",
    "^@/components$|^components$",
    "^@heroicons",
    "^@msaaqco",
    "^@/lib/(.*)$",
    "^@/styles/(.*)$",
    "@vidstack/react/player/styles/default/theme.css",
    "@vidstack/react/player/styles/default/layouts/video.css",
    "^[./]"
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  plugins: [
    {
      parsers: {
        typescript: {
          ...tailwindPlugin.parsers.typescript,
          preprocess: sortImportsPlugin.parsers.typescript.preprocess
        }
      },
      options: {
        ...sortImportsPlugin.options
      }
    }
  ]
};
