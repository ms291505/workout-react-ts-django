import { defineConfig } from "eslint/config";
import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";
import { configs as tsConfigs } from "@typescript-eslint/eslint-plugin"; // Correct import for TypeScript ESLint plugin

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    plugins: { js },
    extends: ["js/recommended"],
  },
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    languageOptions: {
      globals: globals.browser,
    },
  },
  tsConfigs.recommended, // Use TypeScript ESLint's recommended config directly
  pluginReact.configs.recommended, // Use React plugin's recommended config directly
  {
    files: ["**/*.{jsx,tsx}"],
    settings: {
      react: {
        version: "detect",
        runtime: "automatic",
      },
    },
    rules: {
      "react/react-in-jsx-scope": "off", // Disable the requirement for `React` to be in scope
      "no-unused-vars": ["warn"], // Change to 'warn' instead of 'error'
    },
  },
]);
