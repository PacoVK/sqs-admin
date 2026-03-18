export default {
  testEnvironment: "./frontend/setupTests.ts",
  roots: ["<rootDir>/frontend"],
  testMatch: ["**/*.test.tsx"],
  transform: {
    "^.+\\.tsx?$": "./frontend/jestTransformer.cjs",
    "^.+\\.jsx?$": "./frontend/jestTransformer.cjs",
  },
  transformIgnorePatterns: [
    "node_modules/(?!(react-json-tree|react-base16-styling|lodash-es)/)",
  ],
  extensionsToTreatAsEsm: [".ts", ".tsx"],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  collectCoverage: true,
};
