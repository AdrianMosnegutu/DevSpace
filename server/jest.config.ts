module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src"], // Jest will now find tests inside src/__tests__
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  collectCoverage: true,
  coverageDirectory: "coverage",
  collectCoverageFrom: [
    "src/**/*.ts", // ✅ Ensure all .ts files in src/ are checked for coverage
    "!src/**/*.test.ts", // ✅ Exclude test files from coverage
    "!src/**/index.ts", // ✅ Optionally exclude index.ts files
  ],
  moduleDirectories: ["node_modules", "src"], // ✅ Ensures proper module resolution
};
