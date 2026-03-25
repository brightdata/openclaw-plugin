import { wrapWebContent } from "openclaw/plugin-sdk/security-runtime";
import { DEFAULT_BRIGHTDATA_BASE_URL } from "./config.js";

const ENSURED_BRIGHTDATA_ZONES = new Map<string, Promise<boolean>>();

export type BrightDataZoneKind = "browser" | "unlocker";

type TrustedWebToolsEndpointRunner = <T>(
  params: {
    url: string;
    timeoutSeconds: number;
    init?: RequestInit;
  },
  run: (result: { response: Response; finalUrl: string }) => Promise<T>,
) => Promise<T>;

export function resolveBrightDataApiEndpoint(baseUrl: string, pathname: string): string {
  const trimmed = baseUrl.trim();
  try {
    const url = new URL(trimmed || DEFAULT_BRIGHTDATA_BASE_URL);
    url.pathname = pathname;
    url.search = "";
    url.hash = "";
    return url.toString();
  } catch {
    return new URL(pathname, DEFAULT_BRIGHTDATA_BASE_URL).toString();
  }
}

function buildBrightDataZoneCacheKey(params: {
  apiToken: string;
  baseUrl: string;
  zoneName: string;
  kind: BrightDataZoneKind;
}): string {
  return [
    "brightdata-zone",
    params.apiToken.trim(),
    params.baseUrl.trim(),
    params.zoneName.trim(),
    params.kind,
  ].join(":");
}

export function hasBrightDataZone(payload: unknown, zoneName: string): boolean {
  const records = Array.isArray(payload)
    ? payload
    : payload &&
        typeof payload === "object" &&
        !Array.isArray(payload) &&
        Array.isArray((payload as Record<string, unknown>).zones)
      ? ((payload as Record<string, unknown>).zones as unknown[])
      : [];
  return records.some(
    (entry) =>
      entry &&
      typeof entry === "object" &&
      !Array.isArray(entry) &&
      typeof (entry as Record<string, unknown>).name === "string" &&
      ((entry as Record<string, unknown>).name as string).trim() === zoneName,
  );
}

export function buildBrightDataZoneCreatePayload(params: {
  kind: BrightDataZoneKind;
  zoneName: string;
}): Record<string, unknown> {
  if (params.kind === "browser") {
    return {
      zone: { name: params.zoneName, type: "browser_api" },
      plan: { type: "browser_api" },
    };
  }
  return {
    zone: { name: params.zoneName, type: "unblocker" },
    plan: { type: "unblocker", ub_premium: true },
  };
}

export async function requestBrightDataZoneJson(params: {
  requestEndpoint: TrustedWebToolsEndpointRunner;
  apiToken: string;
  baseUrl: string;
  pathname: string;
  timeoutSeconds: number;
  errorLabel: string;
  body?: unknown;
}): Promise<unknown> {
  const endpoint = resolveBrightDataApiEndpoint(params.baseUrl, params.pathname);
  return await params.requestEndpoint(
    {
      url: endpoint,
      timeoutSeconds: params.timeoutSeconds,
      init: {
        method: params.body === undefined ? "GET" : "POST",
        headers: {
          Authorization: `Bearer ${params.apiToken}`,
          Accept: "application/json",
          ...(params.body === undefined ? {} : { "Content-Type": "application/json" }),
        },
        ...(params.body === undefined ? {} : { body: JSON.stringify(params.body) }),
      },
    },
    async ({ response }) => {
      const text = (await response.text()).trim();
      if (!response.ok) {
        throw new Error(
          `${params.errorLabel} failed (${response.status}): ${wrapWebContent(text || response.statusText, "web_fetch")}`,
        );
      }
      if (!text) {
        return null;
      }
      try {
        return JSON.parse(text) as unknown;
      } catch {
        throw new Error(`${params.errorLabel} returned invalid JSON.`);
      }
    },
  );
}

export async function ensureBrightDataZoneExists(params: {
  requestEndpoint: TrustedWebToolsEndpointRunner;
  apiToken: string;
  baseUrl: string;
  zoneName: string;
  kind: BrightDataZoneKind;
  timeoutSeconds: number;
  onError?: (error: unknown) => void;
}): Promise<boolean> {
  const cacheKey = buildBrightDataZoneCacheKey(params);
  const existing = ENSURED_BRIGHTDATA_ZONES.get(cacheKey);
  if (existing) {
    return await existing;
  }

  const ensurePromise = (async () => {
    try {
      const activeZones = await requestBrightDataZoneJson({
        requestEndpoint: params.requestEndpoint,
        apiToken: params.apiToken,
        baseUrl: params.baseUrl,
        pathname: "/zone/get_active_zones",
        timeoutSeconds: params.timeoutSeconds,
        errorLabel: "Bright Data active zones",
      });
      if (hasBrightDataZone(activeZones, params.zoneName)) {
        return true;
      }
      await requestBrightDataZoneJson({
        requestEndpoint: params.requestEndpoint,
        apiToken: params.apiToken,
        baseUrl: params.baseUrl,
        pathname: "/zone",
        timeoutSeconds: params.timeoutSeconds,
        errorLabel: `Bright Data create ${params.kind} zone (${params.zoneName})`,
        body: buildBrightDataZoneCreatePayload({
          kind: params.kind,
          zoneName: params.zoneName,
        }),
      });
      return true;
    } catch (error) {
      ENSURED_BRIGHTDATA_ZONES.delete(cacheKey);
      params.onError?.(error);
      return false;
    }
  })();

  ENSURED_BRIGHTDATA_ZONES.set(cacheKey, ensurePromise);
  return await ensurePromise;
}

export function resetEnsuredBrightDataZones(): void {
  ENSURED_BRIGHTDATA_ZONES.clear();
}
