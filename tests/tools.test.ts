import type { OpenClawPluginApi } from "openclaw/plugin-sdk/plugin-runtime";
import { beforeEach, describe, expect, it, vi } from "vitest";

beforeEach(() => {
  vi.restoreAllMocks();
  vi.resetModules();
  vi.unstubAllEnvs();
  vi.doUnmock("openclaw/plugin-sdk/provider-web-search");
});

// ---------------------------------------------------------------------------
// brightdata_search tool
// ---------------------------------------------------------------------------

describe("brightdata_search tool", () => {
  it("passes query, engine, count, cursor, geo_location, and timeout to runBrightDataSearch", async () => {
    const runBrightDataSearch = vi.fn().mockResolvedValue({ query: "test", results: [] });

    vi.doMock("../src/brightdata-client.js", async () => {
      const actual = await vi.importActual<typeof import("../src/brightdata-client.js")>(
        "../src/brightdata-client.js",
      );
      return { ...actual, runBrightDataSearch };
    });

    const { createBrightDataSearchTool } = await import("../src/brightdata-search-tool.js");
    const tool = createBrightDataSearchTool({ pluginConfig: {} } as unknown as OpenClawPluginApi);

    await tool.execute("call-1", {
      query: "openclaw plugins",
      engine: "bing",
      count: 5,
      cursor: "page-2",
      geo_location: "us",
      timeoutSeconds: 15,
    });

    expect(runBrightDataSearch).toHaveBeenCalledWith({
      pluginConfig: {},
      query: "openclaw plugins",
      engine: "bing",
      count: 5,
      cursor: "page-2",
      geoLocation: "us",
      timeoutSeconds: 15,
    });
  });

  it("defaults engine to undefined when an invalid value is provided", async () => {
    const runBrightDataSearch = vi.fn().mockResolvedValue({ query: "test", results: [] });

    vi.doMock("../src/brightdata-client.js", async () => {
      const actual = await vi.importActual<typeof import("../src/brightdata-client.js")>(
        "../src/brightdata-client.js",
      );
      return { ...actual, runBrightDataSearch };
    });

    const { createBrightDataSearchTool } = await import("../src/brightdata-search-tool.js");
    const tool = createBrightDataSearchTool({ pluginConfig: {} } as unknown as OpenClawPluginApi);

    await tool.execute("call-2", { query: "test", engine: "duckduckgo" });

    expect(runBrightDataSearch).toHaveBeenCalledWith(
      expect.objectContaining({ engine: undefined }),
    );
  });

  it("returns a JSON result wrapping the search response", async () => {
    const searchResponse = { query: "hello", results: [{ title: "Hi", url: "https://hi.example" }] };
    const runBrightDataSearch = vi.fn().mockResolvedValue(searchResponse);

    vi.doMock("../src/brightdata-client.js", async () => {
      const actual = await vi.importActual<typeof import("../src/brightdata-client.js")>(
        "../src/brightdata-client.js",
      );
      return { ...actual, runBrightDataSearch };
    });

    const { createBrightDataSearchTool } = await import("../src/brightdata-search-tool.js");
    const tool = createBrightDataSearchTool({ pluginConfig: {} } as unknown as OpenClawPluginApi);

    const result = await tool.execute("call-3", { query: "hello" });

    expect(result.content).toHaveLength(1);
    const item0 = result.content[0] as { type: string; text: string };
    expect(item0).toMatchObject({ type: "text" });
    const parsed = JSON.parse(item0.text);
    expect(parsed).toMatchObject({ query: "hello", results: [{ title: "Hi" }] });
  });
});

// ---------------------------------------------------------------------------
// brightdata_scrape tool
// ---------------------------------------------------------------------------

describe("brightdata_scrape tool", () => {
  it("passes url, extractMode, maxChars, and timeout to runBrightDataScrape", async () => {
    const runBrightDataScrape = vi.fn().mockResolvedValue({
      finalUrl: "https://example.com",
      text: "content",
      extractor: "brightdata",
      extractMode: "html",
      externalContent: { untrusted: true, source: "web_fetch", wrapped: true },
    });

    vi.doMock("../src/brightdata-client.js", async () => {
      const actual = await vi.importActual<typeof import("../src/brightdata-client.js")>(
        "../src/brightdata-client.js",
      );
      return { ...actual, runBrightDataScrape };
    });

    const { createBrightDataScrapeTool } = await import("../src/brightdata-scrape-tool.js");
    const tool = createBrightDataScrapeTool({ pluginConfig: {} } as unknown as OpenClawPluginApi);

    await tool.execute("call-1", {
      url: "https://example.com",
      extractMode: "html",
      maxChars: 2000,
      timeoutSeconds: 20,
    });

    expect(runBrightDataScrape).toHaveBeenCalledWith({
      pluginConfig: {},
      url: "https://example.com",
      extractMode: "html",
      maxChars: 2000,
      timeoutSeconds: 20,
    });
  });

  it("defaults extractMode to markdown when no mode is provided", async () => {
    const runBrightDataScrape = vi.fn().mockResolvedValue({
      finalUrl: "https://example.com",
      text: "content",
      extractor: "brightdata",
      extractMode: "markdown",
      externalContent: { untrusted: true, source: "web_fetch", wrapped: true },
    });

    vi.doMock("../src/brightdata-client.js", async () => {
      const actual = await vi.importActual<typeof import("../src/brightdata-client.js")>(
        "../src/brightdata-client.js",
      );
      return { ...actual, runBrightDataScrape };
    });

    const { createBrightDataScrapeTool } = await import("../src/brightdata-scrape-tool.js");
    const tool = createBrightDataScrapeTool({ pluginConfig: {} } as unknown as OpenClawPluginApi);

    await tool.execute("call-2", { url: "https://example.com" });

    expect(runBrightDataScrape).toHaveBeenCalledWith(
      expect.objectContaining({ extractMode: "markdown" }),
    );
  });

  it("defaults extractMode to markdown when an unrecognized mode is given", async () => {
    const runBrightDataScrape = vi.fn().mockResolvedValue({
      finalUrl: "https://example.com",
      text: "content",
      extractor: "brightdata",
      extractMode: "markdown",
      externalContent: { untrusted: true, source: "web_fetch", wrapped: true },
    });

    vi.doMock("../src/brightdata-client.js", async () => {
      const actual = await vi.importActual<typeof import("../src/brightdata-client.js")>(
        "../src/brightdata-client.js",
      );
      return { ...actual, runBrightDataScrape };
    });

    const { createBrightDataScrapeTool } = await import("../src/brightdata-scrape-tool.js");
    const tool = createBrightDataScrapeTool({ pluginConfig: {} } as unknown as OpenClawPluginApi);

    await tool.execute("call-3", { url: "https://example.com", extractMode: "pdf" });

    expect(runBrightDataScrape).toHaveBeenCalledWith(
      expect.objectContaining({ extractMode: "markdown" }),
    );
  });

  it("returns a JSON result wrapping the scrape response", async () => {
    const scrapeResponse = {
      finalUrl: "https://example.com",
      text: "# Title\nBody",
      extractor: "brightdata",
      extractMode: "markdown",
      externalContent: { untrusted: true, source: "web_fetch", wrapped: true },
    };
    const runBrightDataScrape = vi.fn().mockResolvedValue(scrapeResponse);

    vi.doMock("../src/brightdata-client.js", async () => {
      const actual = await vi.importActual<typeof import("../src/brightdata-client.js")>(
        "../src/brightdata-client.js",
      );
      return { ...actual, runBrightDataScrape };
    });

    const { createBrightDataScrapeTool } = await import("../src/brightdata-scrape-tool.js");
    const tool = createBrightDataScrapeTool({ pluginConfig: {} } as unknown as OpenClawPluginApi);

    const result = await tool.execute("call-4", { url: "https://example.com" });

    expect(result.content).toHaveLength(1);
    const item0 = result.content[0] as { type: string; text: string };
    expect(item0).toMatchObject({ type: "text" });
    const parsed = JSON.parse(item0.text);
    expect(parsed).toMatchObject({ finalUrl: "https://example.com", extractMode: "markdown" });
  });
});

// ---------------------------------------------------------------------------
// brightdata web search provider
// ---------------------------------------------------------------------------

describe("brightdata web search provider", () => {
  it("returns provider with id brightdata and correct metadata", async () => {
    const { createBrightDataWebSearchProvider } = await import(
      "../src/brightdata-search-provider.js"
    );
    const provider = createBrightDataWebSearchProvider();

    expect(provider.id).toBe("brightdata");
    expect(provider.label).toBe("Bright Data Search");
    expect(provider.envVars).toContain("BRIGHTDATA_API_TOKEN");
    expect(provider.credentialPath).toBe(
      "plugins.entries.brightdata.config.webSearch.apiKey",
    );
  });

  it("getCredentialValue reads apiKey from scoped brightdata config", async () => {
    const { createBrightDataWebSearchProvider } = await import(
      "../src/brightdata-search-provider.js"
    );
    const provider = createBrightDataWebSearchProvider();

    const value = provider.getCredentialValue?.({ brightdata: { apiKey: "my-key" } });
    expect(value).toBe("my-key");
  });

  it("getCredentialValue returns undefined when brightdata config is absent", async () => {
    const { createBrightDataWebSearchProvider } = await import(
      "../src/brightdata-search-provider.js"
    );
    const provider = createBrightDataWebSearchProvider();

    expect(provider.getCredentialValue?.({})).toBeUndefined();
    expect(provider.getCredentialValue?.(undefined)).toBeUndefined();
  });

  it("setCredentialValue writes apiKey into the scoped brightdata config", async () => {
    const { createBrightDataWebSearchProvider } = await import(
      "../src/brightdata-search-provider.js"
    );
    const provider = createBrightDataWebSearchProvider();

    const target: Record<string, unknown> = {};
    provider.setCredentialValue?.(target, "new-key");
    expect((target.brightdata as Record<string, unknown>)?.apiKey).toBe("new-key");
  });

  it("setCredentialValue updates apiKey when brightdata config already exists", async () => {
    const { createBrightDataWebSearchProvider } = await import(
      "../src/brightdata-search-provider.js"
    );
    const provider = createBrightDataWebSearchProvider();

    const target: Record<string, unknown> = { brightdata: { apiKey: "old-key" } };
    provider.setCredentialValue?.(target, "updated-key");
    expect((target.brightdata as Record<string, unknown>)?.apiKey).toBe("updated-key");
  });

  it("createTool returns a tool that calls runBrightDataSearch with the search config", async () => {
    const runBrightDataSearch = vi.fn().mockResolvedValue({ query: "hello", results: [] });

    vi.doMock("../src/brightdata-client.js", async () => {
      const actual = await vi.importActual<typeof import("../src/brightdata-client.js")>(
        "../src/brightdata-client.js",
      );
      return { ...actual, runBrightDataSearch };
    });

    const { createBrightDataWebSearchProvider } = await import(
      "../src/brightdata-search-provider.js"
    );
    const provider = createBrightDataWebSearchProvider();
    const tool = provider.createTool({ searchConfig: { apiKey: "key-from-config" } } as never);

    await tool?.execute({ query: "hello" });

    expect(runBrightDataSearch).toHaveBeenCalledWith({
      pluginConfig: { webSearch: { apiKey: "key-from-config" } },
      query: "hello",
      count: undefined,
    });
  });

  it("createTool passes undefined pluginConfig when searchConfig is absent", async () => {
    const runBrightDataSearch = vi.fn().mockResolvedValue({ query: "test", results: [] });

    vi.doMock("../src/brightdata-client.js", async () => {
      const actual = await vi.importActual<typeof import("../src/brightdata-client.js")>(
        "../src/brightdata-client.js",
      );
      return { ...actual, runBrightDataSearch };
    });

    const { createBrightDataWebSearchProvider } = await import(
      "../src/brightdata-search-provider.js"
    );
    const provider = createBrightDataWebSearchProvider();
    const tool = provider.createTool({} as never);

    await tool?.execute({ query: "test" });

    expect(runBrightDataSearch).toHaveBeenCalledWith(
      expect.objectContaining({ pluginConfig: undefined }),
    );
  });
});
