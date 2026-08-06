/**
 * CyberServices KV Corruption Guard
 * 
 * ONE JOB:
 * Protect KV reads from corrupted records.
 *
 * Owns:
 * - Reading KV JSON safely
 * - Detecting serialization corruption
 * - Emitting deterministic corruption events
 * - Optional automatic cleanup
 *
 * Does NOT:
 * - Repair records
 * - Rebuild state
 * - Decide business logic
 * - Retry requests
 */

export type KVCorruptionReason =
  | "INVALID_JSON"
  | "EMPTY_VALUE"
  | "UNEXPECTED_TYPE";

export interface KVCorruptionEvent {
  key: string;
  reason: KVCorruptionReason;
  timestamp: string;
  rawLength: number;
  trimmedLength?: number;
}

export interface KVCorruptionLogger {
  (event: KVCorruptionEvent): void | Promise<void>;
}

export interface ReadKVJsonOptions<T> {
  namespace: KVNamespace;
  key: string;
  autoClear?: boolean;
  asyncLogging?: boolean;

  validate?: (value: unknown) => value is T;

  logger?: KVCorruptionLogger;
}

export async function readKVJson<T>(
  options: ReadKVJsonOptions<T>
): Promise<T | null> {

  let raw: unknown;

  // KV get can throw — must be guarded
  try {
    raw = await options.namespace.get(options.key);
  } catch {
    await safeReport(options, "", "UNEXPECTED_TYPE");
    return null;
  }

  if (raw === null) {
    return null;
  }

  if (typeof raw !== "string") {
    await safeReport(
      options,
      String(raw ?? ""),
      "UNEXPECTED_TYPE"
    );
    return null;
  }

  const trimmed = raw.trim();

  if (trimmed === "") {
    await safeReport(
      options,
      raw,
      "EMPTY_VALUE"
    );
    return null;
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(trimmed);
  } catch {
    await safeReport(
      options,
      raw,
      "INVALID_JSON"
    );
    return null;
  }

  if (options.validate) {
    let valid = false;

    try {
      valid = options.validate(parsed);
    } catch {
      await safeReport(
        options,
        raw,
        "UNEXPECTED_TYPE"
      );
      return null;
    }

    if (!valid) {
      await safeReport(
        options,
        raw,
        "UNEXPECTED_TYPE"
      );
      return null;
    }
  }

  return parsed as T;
}

async function safeReport<T>(
  options: ReadKVJsonOptions<T>,
  raw: string,
  reason: KVCorruptionReason
): Promise<void> {

  const trimmedLength = raw.trim().length;

  const event: KVCorruptionEvent = {
    key: options.key,
    reason,
    timestamp: new Date().toISOString(),
    rawLength: raw.length,
    trimmedLength
  };

  if (options.asyncLogging) {
    void options.logger?.(event).catch(() => {
      // Async logger failures must never crash callers.
    });
  } else {
    try {
      await options.logger?.(event);
    } catch {
      // Logger failures must never crash KV protection.
    }
  }

  if (options.autoClear) {
    try {
      await options.namespace.delete(options.key);
    } catch {
      // Cleanup failures must never crash KV protection.
    }
  }
}
