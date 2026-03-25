import { Type } from "@sinclair/typebox";
import { jsonResult, readNumberParam, readStringParam } from "openclaw/plugin-sdk/agent-runtime";
import type { OpenClawPluginApi } from "openclaw/plugin-sdk/plugin-runtime";
import { runBrightDataScrape } from "./brightdata-client.js";

function optionalStringEnum<const T extends readonly string[]>(
  values: T,
  options: { description?: string } = {},
) {
  return Type.Optional(
    Type.Unsafe<T[number]>({
      type: "string",
      enum: [...values],
      ...options,
    }),
  );
}

const BrightDataScrapeToolSchema = Type.Object(
  {
    url: Type.String({ description: "HTTP or HTTPS URL to scrape via Bright Data." }),
    extractMode: optionalStringEnum(["markdown", "text", "html"] as const, {
      description: 'Extraction mode ("markdown", "text", or "html"). Default: markdown.',
    }),
    maxChars: Type.Optional(
      Type.Number({
        description: "Maximum characters to return.",
        minimum: 100,
      }),
    ),
    timeoutSeconds: Type.Optional(
      Type.Number({
        description: "Timeout in seconds for the Bright Data scrape request.",
        minimum: 1,
      }),
    ),
  },
  { additionalProperties: false },
);

export function createBrightDataScrapeTool(api: OpenClawPluginApi) {
  return {
    name: "brightdata_scrape",
    label: "Bright Data Scrape",
    description:
      "Fetch and extract a page directly through Bright Data Web Unlocker. Use this tool when you specifically want Bright Data-backed web fetching, including bot-protected pages.",
    parameters: BrightDataScrapeToolSchema,
    execute: async (_toolCallId: string, rawParams: Record<string, unknown>) => {
      const url = readStringParam(rawParams, "url", { required: true });
      const extractModeRaw = readStringParam(rawParams, "extractMode");
      const extractMode =
        extractModeRaw === "text" || extractModeRaw === "html" ? extractModeRaw : "markdown";
      const maxChars = readNumberParam(rawParams, "maxChars", { integer: true });
      const timeoutSeconds = readNumberParam(rawParams, "timeoutSeconds", {
        integer: true,
      });

      return jsonResult(
        await runBrightDataScrape({
          pluginConfig: api.pluginConfig,
          url,
          extractMode,
          maxChars,
          timeoutSeconds,
        }),
      );
    },
  };
}
