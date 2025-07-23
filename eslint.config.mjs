import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import SimpleImportSort from "eslint-plugin-simple-import-sort";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    plugins: { js, "simple-import-sort": SimpleImportSort },
    extends: ["js/recommended"],
    rules: {
      "simple-import-sort/imports": "warn",
    },
    ignores: ["**/node_modules/**"],
  },
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    languageOptions: { globals: globals.node },
    ignores: ["**/node_modules/**"],
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
    },
  },
  tseslint.configs.recommended,
]);
