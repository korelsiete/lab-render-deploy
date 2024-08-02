import globals from "globals";
import stylisticJs from "@stylistic/eslint-plugin-js";

export default [
  {
    ignores: ["node_modules/**", "dist/**"],
  },
  {
    files: ["**/*.js"],
    languageOptions: { ecmaVersion: "latest", sourceType: "script" },
    plugins: {
      "@stylistic/js": stylisticJs,
    },
    rules: {
      eqeqeq: "error",
      "no-trailing-spaces": "error",
      "object-curly-spacing": ["error", "always"],
      "arrow-spacing": ["error", { before: true, after: true }],
      "no-unused-vars": "warn",
      "@stylistic/js/indent": ["error", 2],
      "@stylistic/js/linebreak-style": ["error", "unix"],
      "@stylistic/js/quotes": ["warn", "double"],
      "@stylistic/js/semi": ["error", "always"],
      "no-console": 0,
    },
  },
  { languageOptions: { globals: globals.node } },
];
