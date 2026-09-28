import "server-only";

export class ErpError extends Error {
  status?: number;
  code: "configuration" | "timeout" | "http" | "network" | "invalid_response";
  details?: unknown;

  constructor(
    message: string,
    code: ErpError["code"],
    status?: number,
    details?: unknown,
  ) {
    super(message);
    this.name = "ErpError";
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

type ErpResponse<T> = { message?: T } & Record<string, unknown>;
const timeoutMs = 8000;

function isMockMode() {
  return process.env.USE_MOCK_DATA === "true" || !process.env.ERP_BASE_URL;
}

export function isErpConfigured() {
  return (
    !isMockMode() &&
    Boolean(process.env.ERP_API_KEY && process.env.ERP_API_SECRET)
  );
}

export async function erpFetch<T>(
  path: string,
  init: RequestInit = {},
  tags: string[] = [],
) {
  if (isMockMode() || !process.env.ERP_API_KEY || !process.env.ERP_API_SECRET) {
    throw new ErpError("ERPNext is not configured", "configuration");
  }
  const url = `${process.env.ERP_BASE_URL!.replace(/\/$/, "")}/api/method/${path.replace(/^\//, "")}`;
  const headers = new Headers(init.headers);
  headers.set(
    "Authorization",
    `token ${process.env.ERP_API_KEY}:${process.env.ERP_API_SECRET}`,
  );
  headers.set("Accept", "application/json");
  if (init.body) headers.set("Content-Type", "application/json");
  const isGet = !init.method || init.method.toUpperCase() === "GET";
  let lastError: unknown;

  for (let attempt = 0; attempt < 2; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(url, {
        ...init,
        headers,
        signal: controller.signal,
        ...(isGet
          ? { next: { revalidate: 300, tags: ["blc", ...tags] } }
          : { cache: "no-store" }),
      });
      const payload = (await response
        .json()
        .catch(() => null)) as ErpResponse<T> | null;
      if (!response.ok)
        throw new ErpError(
          `ERPNext request failed with status ${response.status}`,
          "http",
          response.status,
          payload,
        );
      if (!payload)
        throw new ErpError(
          "ERPNext returned an invalid response",
          "invalid_response",
          response.status,
        );
      return (payload.message ?? payload) as T;
    } catch (error) {
      lastError =
        error instanceof ErpError
          ? error
          : controller.signal.aborted
            ? new ErpError("ERPNext request timed out", "timeout")
            : new ErpError(
                "ERPNext request failed",
                "network",
                undefined,
                error,
              );
      if (attempt === 0)
        await new Promise((resolve) => setTimeout(resolve, 50));
    } finally {
      clearTimeout(timeout);
    }
  }
  throw lastError instanceof ErpError
    ? lastError
    : new ErpError("ERPNext request failed", "network");
}
