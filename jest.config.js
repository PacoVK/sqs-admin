module.exports = {
  testEnvironment: "./frontend/setupTests.ts",
  roots: ["<rootDir>/frontend"],
  testMatch: ["**/*.test.tsx"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  collectCoverage: true,
};
