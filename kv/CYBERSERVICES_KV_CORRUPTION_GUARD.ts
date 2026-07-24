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
}

export interface KVCorruptionLogger {
  (event: KVCorruptionEvent): void | Promise<void>;
}

export interface ReadKVJsonOptions<T> {
  namespace: KVNamespace;
  key: string;
  autoClear?: boolean;
  validate?: (value: unknown) => value is T;
  logger?: KVCorruptionLogger;
}

export async function readKVJson<T>(
  options: ReadKVJsonOptions<T>
): Promise<T | null> {

  const raw = await options.namespace.get(options.key);

  if (raw === null) {
    return null;
  }

  if (raw.trim() === "") {

    await report(
      options,
      raw,
      "EMPTY_VALUE"
    );

    return null;
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(raw);
  } catch {

    await report(
      options,
      raw,
      "INVALID_JSON"
    );

    return null;
  }

  if (
    options.validate &&
    !options.validate(parsed)
  ) {

    await report(
      options,
      raw,
      "UNEXPECTED_TYPE"
    );

    return null;
  }

  return parsed as T;
}

async function report<T>(
  options: ReadKVJsonOptions<T>,
  raw: string,
  reason: KVCorruptionReason
) {

  await options.logger?.({
    key: options.key,
    reason,
    timestamp: new Date().toISOString(),
    rawLength: raw.length
  });

  if (options.autoClear) {
    await options.namespace.delete(options.key);
  }
}
