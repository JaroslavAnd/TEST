/** @type {import('jest').Config} */
const config = {
  // Використовуємо ts-jest для TypeScript
  preset: "ts-jest",

  // jsdom для тестування React-компонентів
  testEnvironment: "jsdom",

  // Файли налаштувань
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],

  // Де шукати тести
  testMatch: [
    "<rootDir>/src/__tests__/**/*.test.{ts,tsx}",
    "<rootDir>/src/**/__tests__/**/*.test.{ts,tsx}",
  ],

  // Ігнорувати
  testPathIgnorePatterns: [
    "<rootDir>/node_modules/",
    "<rootDir>/.next/",
    "<rootDir>/tests/e2e/",
  ],

  // Маппінг path aliases (як у tsconfig)
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    // Mock CSS modules
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },

  // ts-jest трансформація
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.json",
        // Не перевіряти типи при тестуванні (пришвидшує)
        diagnostics: false,
      },
    ],
  },

  // Не трансформувати node_modules
  transformIgnorePatterns: ["/node_modules/"],

  // Coverage налаштування
  collectCoverageFrom: [
    "src/lib/**/*.{ts,tsx}",
    "src/components/**/*.{ts,tsx}",
    "src/types/**/*.{ts,tsx}",
    "src/hooks/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/generated/**",
    "!src/lib/prisma.ts",
    "!src/components/SessionProvider.tsx",
    "!src/components/Navigation/**",
  ],

  // Мінімальний поріг coverage — 40%
  coverageThreshold: {
    global: {
      branches: 40,
      functions: 40,
      lines: 40,
      statements: 40,
    },
  },

  coverageDirectory: "coverage",
};

module.exports = config;
