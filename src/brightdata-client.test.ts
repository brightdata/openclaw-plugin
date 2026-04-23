import { afterEach, describe, expect, it } from "vitest";
import { __testing, runBrightDataSearch } from "./brightdata-client.js";

const ORIGINAL_ENV = {
  BRIGHTDATA_API_KEY: process.env.BRIGHTDATA_API_KEY,
  BRIGHTDATA_SERP_ZONE: process.env.BRIGHTDATA_SERP_ZONE,
};

afterEach(() => {
  if (ORIGINAL_ENV.BRIGHTDATA_API_KEY === undefined) {
    delete process.env.BRIGHTDATA_API_KEY;
  } else {
    process.env.BRIGHTDATA_API_KEY = ORIGINAL_ENV.BRIGHTDATA_API_KEY;
  }
  if (ORIGINAL_ENV.BRIGHTDATA_SERP_ZONE === undefined) {
    delete process.env.BRIGHTDATA_SERP_ZONE;
  } else {
    process.env.BRIGHTDATA_SERP_ZONE = ORIGINAL_ENV.BRIGHTDATA_SERP_ZONE;
  }
});

describe("brightdata client helpers", () => {
  it("builds SERP request body with explicit serp zone", () => {
    expect(
      __testing.buildBrightDataSerpRequestBody({
        requestUrl: "https://www.google.com/search?q=openclaw&brd_json=1",
        serpZone: "my_serp_zone",
        engine: "google",
      }),
    ).toEqual({
      url: "https://www.google.com/search?q=openclaw&brd_json=1",
      zone: "my_serp_zone",
      format: "raw",
      data_format: "parsed_light",
    });
  });

  it("detects async-serp-disabled errors", () => {
    expect(
      __testing.isAsyncSerpDisabledError({
        detail: "Async mode is not enabled for this zone",
      }),
    ).toBe(true);
    expect(
      __testing.isAsyncSerpDisabledError({
        detail: "Some other validation error",
      }),
    ).toBe(false);
  });

  it("extracts dataset progress failure messages", () => {
    expect(__testing.readProgressFailureMessage({ error_message: "zone suspended" })).toBe(
      "zone suspended",
    );
    expect(__testing.readProgressFailureMessage({ message: "snapshot is empty" })).toBe(
      "snapshot is empty",
    );
    expect(__testing.readProgressFailureMessage({})).toBeUndefined();
  });

  it("fails search with a targeted error when no serp zone is configured", async () => {
    process.env.BRIGHTDATA_API_KEY = "key";
    delete process.env.BRIGHTDATA_SERP_ZONE;
    await expect(
      runBrightDataSearch({
        query: "test",
      }),
    ).rejects.toThrow("Bright Data search requires a SERP zone");
  });
});
