import type { Config } from "jest";

export default async (): Promise<Config> => {
  return {
    preset: "ts-jest",
    testEnvironment: "./frontend/setupTests.ts",
    setupFiles: ["<rootDir>/jest-setup.ts"],
    roots: ["<rootDir>/frontend"],
    testMatch: ["**/*.test.tsx"],
    transform: {
      "^.+\\.tsx?$": [
        "ts-jest",
        {
          tsconfig: "<rootDir>/tsconfig.jest.json",
          diagnostics: {
            ignoreCodes: [1343],
          },
          astTransformers: {
            before: [
              {
                path: "node_modules/ts-jest-mock-import-meta",
                options: {
                  metaObjectReplacement: { env: { VITE_APP_VERSION: "test" } },
                },
              },
            ],
          },
        },
      ],
    },
    collectCoverage: true,
  };
};
