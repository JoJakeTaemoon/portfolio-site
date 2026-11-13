import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "snippets/**", // excerpts, not compilable
    "public/assets/**", // the design-taste-frontend kit, copied unchanged (the skill's gate checks it is not edited)
    ".taste-skill/**", // the skill's run state: headless Chrome profiles
  ]),
]);

export default eslintConfig;
