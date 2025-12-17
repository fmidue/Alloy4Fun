import { defineConfig } from "eslint/config";
import { fixupPluginRules } from "@eslint/compat";
import js from "@eslint/js";
import meteorPlugin from "eslint-plugin-meteor";

export default defineConfig([
  {
    ignores: ["**/node_modules/**", "**/.meteor/**"]
  },
  {
    files: ["**/*.js"],
    plugins: {
      js,
      meteor: fixupPluginRules(meteorPlugin)
    },
    extends: ["js/recommended"],
    rules: {
      ...meteorPlugin.configs.recommended.rules,
      "no-undef": "off",
      "no-unused-vars": "warn",
      "no-useless-escape": "warn",
      "meteor/audit-argument-checks": "off",
      "meteor/no-session": "off"
    }
  }
]);
