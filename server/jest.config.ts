module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/tests"], // Jest will look for tests in the 'tests' directory
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
};
