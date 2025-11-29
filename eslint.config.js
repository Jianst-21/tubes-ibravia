import eslint from "@eslint/js";
import reactPlugin from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import jsxA11y from "eslint-plugin-jsx-a11y";
import prettier from "eslint-plugin-prettier";
import globals from "globals";
import unicorn from "eslint-plugin-unicorn";

export default [
  // Base ESLint rules
  eslint.configs.recommended,

  // React + JSX + Hooks
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooks,
      "jsx-a11y": jsxA11y,
      prettier,
      unicorn,
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",

      // A11y plugin
      ...jsxA11y.configs.recommended.rules,

      // Integrasi Prettier (supaya ESLint laporin formatting)
      "prettier/prettier": "warn",

      // Unicorn plugin
      "no-unused-vars": "warn",
      "unicorn/prefer-query-selector": "error",
      "unicorn/prefer-dom-node-text-content": "warn",
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },

  // Matikan rules ESLint yang bertabrakan dengan Prettier
  {
    rules: {
      "no-mixed-spaces-and-tabs": "off",
    },
  },
];
