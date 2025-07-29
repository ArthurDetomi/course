import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    ignores: ["build/**", "mongo.js", "eslint.config.mjs"], // ⬅️ ignora a pasta e o arquivo desejado
  },
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
      sourceType: "commonjs", // já está no seu config
    },
    rules: {
      indent: ["error", 2],
      "linebreak-style": ["error", "unix"],
      "no-unused-vars": "off",
    },
  },
]);
