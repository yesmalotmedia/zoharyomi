import { defineConfig } from "eslint/config";
import nextPlugin from "eslint-plugin-next";

export default defineConfig([
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    ignores: [".next/**", "out/**", "build/**", "next-env.d.ts"],

    languageOptions: {
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
    },

    plugins: {
      next: nextPlugin,
    },

    rules: {
      ...nextPlugin.configs.recommended.rules,
    },
  },
]);
