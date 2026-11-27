import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";

/**
 * ESLint flat config.
 *
 * `eslint-config-next` 16 ships native flat configs. Running them through
 * `FlatCompat` crashed the linter with "Converting circular structure to JSON"
 * while validating the plugin graph, so they are imported directly instead.
 */
const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypeScript,
  {
    ignores: [".next/**", "node_modules/**", "next-env.d.ts", "public/**", "docs/**"],
  },
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
  {
    /*
     * react-three-fiber runs its scene graph through an imperative frame loop:
     * `useFrame` mutates refs, vectors and scene properties by design. The React
     * Compiler lint rules read that as render-phase mutation, which it is —
     * deliberately, because the render loop is outside React's model. Scoped to
     * the 3D layer so the rules stay enforced everywhere else.
     */
    files: ["components/three/**"],
    rules: {
      "react-hooks/immutability": "off",
      "react-hooks/purity": "off",
    },
  },
  {
    /*
     * `useSyncExternalStore`-style hydration reads: localStorage and
     * matchMedia cannot be read on the server, so the value has to be resolved
     * after mount. Reading them during render instead would make the first
     * client render disagree with the server HTML.
     */
    files: ["components/motion/**"],
    rules: {
      "react-hooks/set-state-in-effect": "off",
    },
  },
];

export default eslintConfig;