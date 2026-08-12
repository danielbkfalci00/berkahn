import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

export default defineConfig([
  ...nextVitals,
  {
    // Next 16 passou a habilitar regras voltadas ao React Compiler. O projeto
    // ainda não usa o compiler e possui padrões válidos de sincronização com
    // APIs externas (carrossel, autosave, bridge de iframe). Mantemos o mesmo
    // contrato do gate anterior; estas regras devem voltar junto da adoção do
    // compiler, em uma migração própria e testada por fluxo.
    rules: {
      "react-hooks/incompatible-library": "off",
      "react-hooks/purity": "off",
      "react-hooks/refs": "off",
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/static-components": "off",
    },
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    ".worktrees/**",
  ]),
]);
