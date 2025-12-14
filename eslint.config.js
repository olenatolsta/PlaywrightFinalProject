const tseslint = require("@typescript-eslint/eslint-plugin");
const tsParser = require("@typescript-eslint/parser");
const playwright = require("eslint-plugin-playwright");
const prettier = require("eslint-plugin-prettier");

/** @type {import('eslint').ESLint.ConfigArray} */
module.exports = [
  // Base config for app code: pages, helpers, utils
  {
    files: ["**/*.ts", "**/*.tsx"],
    ignores: ["tests/**"],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2021,
      sourceType: "module"
    },
    plugins: {
      "@typescript-eslint": tseslint,
      prettier
    },
    rules: {
      // --- PRETTIER FORMATTING ---
      "prettier/prettier": "error",

      // --- SOFT TYPESCRIPT RULES ---
      "@typescript-eslint/no-unused-vars": ["warn"],
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-inferrable-types": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-empty-function": "off",

      // --- GENERAL JS RULES ---
      "no-undef": "off", // TS handles this
      "no-empty": "warn",
      "no-console": "off" // tests often log things
    }
  },

  // Playwright rules for tests
  {
    files: ["tests/**/*.ts"],
    languageOptions: {
      parser: tsParser
    },
    plugins: {
      playwright,
      prettier
    },
    rules: {
      "prettier/prettier": "error",

      // Playwright soft rules
      "playwright/no-skipped-test": "warn",
      "playwright/no-focused-test": "warn",
      "playwright/no-conditional-in-test": "off",
      "playwright/prefer-lowercase-title": "off",

      // You write tests, not production code → keep it soft
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off"
    }
  }
];
