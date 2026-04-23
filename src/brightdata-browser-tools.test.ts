import { afterEach, describe, expect, it } from "vitest";
import { __testing } from "./brightdata-browser-tools.js";

const ORIGINAL_BROWSER_AUTH = process.env.BROWSER_AUTH;

afterEach(() => {
  if (ORIGINAL_BROWSER_AUTH === undefined) {
    delete process.env.BROWSER_AUTH;
    return;
  }
  process.env.BROWSER_AUTH = ORIGINAL_BROWSER_AUTH;
});

describe("brightdata browser helpers", () => {
  it("parses BROWSER_AUTH credentials", () => {
    expect(__testing.parseBrowserAuth("brd-customer-123-zone-my_zone:secret-pass")).toEqual({
      customer: "123",
      zone: "my_zone",
      password: "secret-pass",
    });
    expect(__testing.parseBrowserAuth("bad-format")).toBeNull();
  });

  it("uses BROWSER_AUTH as browser credential fast-path", async () => {
    process.env.BROWSER_AUTH = "brd-customer-abc-zone-zone_its:top-secret";
    const endpoint = await __testing.resolveBrightDataBrowserCdpEndpoint({
      country: "us",
    });
    expect(endpoint).toContain("wss://brd-customer-abc-zone-zone_its-country-us:top-secret@");
  });

  it("returns structured unsupported history message", () => {
    const result = __testing.unsupportedBrowserHistoryResult("back");
    expect(result.details).toMatchObject({
      ok: false,
      action: "back",
      error: {
        code: "unsupported_operation",
      },
    });
  });
});
