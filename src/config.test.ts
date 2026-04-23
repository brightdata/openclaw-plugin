import { afterEach, describe, expect, it } from "vitest";
import { resolveBrightDataApiToken, resolveBrightDataSerpZone } from "./config.js";

const ENV_KEYS = ["BRIGHTDATA_API_KEY", "BRIGHTDATA_API_TOKEN", "BRIGHTDATA_SERP_ZONE"] as const;

const ORIGINAL_ENV: Record<(typeof ENV_KEYS)[number], string | undefined> = {
  BRIGHTDATA_API_KEY: process.env.BRIGHTDATA_API_KEY,
  BRIGHTDATA_API_TOKEN: process.env.BRIGHTDATA_API_TOKEN,
  BRIGHTDATA_SERP_ZONE: process.env.BRIGHTDATA_SERP_ZONE,
};

afterEach(() => {
  for (const key of ENV_KEYS) {
    const value = ORIGINAL_ENV[key];
    if (value === undefined) {
      delete process.env[key];
      continue;
    }
    process.env[key] = value;
  }
});

describe("config resolution", () => {
  it("prefers BRIGHTDATA_API_KEY over BRIGHTDATA_API_TOKEN", () => {
    process.env.BRIGHTDATA_API_KEY = "key-preferred";
    process.env.BRIGHTDATA_API_TOKEN = "token-fallback";
    expect(resolveBrightDataApiToken(undefined)).toBe("key-preferred");
  });

  it("uses configured apiKey before environment variables", () => {
    process.env.BRIGHTDATA_API_KEY = "env-key";
    const config = {
      webSearch: {
        apiKey: "configured-secret",
      },
    };
    expect(resolveBrightDataApiToken(config)).toBe("configured-secret");
  });

  it("resolves serp zone from config and falls back to BRIGHTDATA_SERP_ZONE", () => {
    process.env.BRIGHTDATA_SERP_ZONE = "env-serp";
    expect(resolveBrightDataSerpZone(undefined)).toBe("env-serp");
    expect(resolveBrightDataSerpZone({ webSearch: { serpZone: "config-serp" } })).toBe(
      "config-serp",
    );
  });
});
