const globals = require("globals");
const tseslint = require("@typescript-eslint/parser");
const eslintPluginReact = require("eslint-plugin-react");
const eslintPluginReactHooks = require("eslint-plugin-react-hooks");
const nextPlugin = require("@next/eslint-plugin-next");
const eslintJs = require("@eslint/js");

module.exports = [
  {
    ignores: ["node_modules/", ".next/", "functions/", "next.config.js", "next.config.mjs", "server.js", "eslint.config.js"],
  },
  eslintJs.configs.recommended,
  {
        files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tseslint,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        project: "./tsconfig.json",
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      "react": eslintPluginReact,
      "react-hooks": eslintPluginReactHooks,
      "@next/next": nextPlugin,
    },
    rules: {
      ...eslintPluginReact.configs.recommended.rules,
      ...eslintPluginReactHooks.configs.recommended.rules,
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
      "react/react-in-jsx-scope": "off",
      "no-unused-vars": "warn",
      "no-undef": "warn",
      "react/no-unknown-property": ["error", { "ignore": ["jsx"] }],
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "warn",
    },
  },
];
