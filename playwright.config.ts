import { defineConfig, devices } from "@playwright/test";
import path from "node:path";

const frontendDir = __dirname;
const backendDir = path.resolve(__dirname, "../pocket-circle-backend");
const e2eOrigin = "http://localhost:3100";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  workers: 1,
  timeout: 90_000,
  expect: { timeout: 15_000 },
  use: {
    baseURL: e2eOrigin,
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: [
    {
      command: "pnpm start:dev",
      cwd: backendDir,
      url: "http://localhost:4001/api/v1",
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
      env: {
        ...process.env,
        PORT: "4001",
        FRONTEND_URL: "http://localhost:3100",
        RESEND_DEMO_MODE: "true",
      },
    },
    {
      command: "pnpm dev --port 3100",
      cwd: frontendDir,
      url: e2eOrigin,
      reuseExistingServer: false,
      timeout: 120_000,
      env: {
        ...process.env,
        BACKEND_URL: "http://localhost:4001",
      },
    },
  ],
});
