/**
 * CyberServices KV Corruption Ledger
 *
 * ONE JOB:
 * Preserve KV corruption events as immutable operational evidence.
 *
 * Owns:
 * - Accepting structured corruption events
 * - Creating ledger records
 * - Returning stored corruption records
 *
 * Does NOT:
 * - Detect corruption
 * - Parse KV values
 * - Repair records
 * - Delete keys
 * - Control operation state
 */

export interface KVCorruptionLedgerEvent {
  key: string;
  reason: string;
  timestamp: string;
  rawLength: number;
  trimmedLength?: number;
}


export interface KVCorruptionLedgerRecord {
  id: string;
  type: "KV_CORRUPTION";
  version: 1;
  createdAt: string;
  event: KVCorruptionLedgerEvent & {
    trimmedLength: number | null;
  };
}


export interface KVCorruptionLedgerStore {
  put(
    key: string,
    value: string
  ): Promise<void>;

  get(
    key: string
  ): Promise<string | null>;
}


export class CyberServicesKVCorruptionLedger {

  constructor(
    private readonly store: KVCorruptionLedgerStore
  ) {}


  async record(
    event: KVCorruptionLedgerEvent
  ): Promise<KVCorruptionLedgerRecord> {

    const record: KVCorruptionLedgerRecord = {
      id: crypto.randomUUID(),
      type: "KV_CORRUPTION",
      version: 1,
      createdAt: new Date().toISOString(),
      event: {
        ...event,
        trimmedLength: event.trimmedLength ?? null
      }
    };


    try {

      await this.store.put(
        `kv-corruption:${record.id}`,
        JSON.stringify(record)
      );

    } catch {

      // Ledger storage failure must not mutate evidence.
    }


    return record;
  }


  async get(
    id: string
  ): Promise<KVCorruptionLedgerRecord | null> {

    let raw: string | null;


    try {

      raw = await this.store.get(
        `kv-corruption:${id}`
      );

    } catch {

      return null;
    }


    if (!raw) {
      return null;
    }


    try {

      return JSON.parse(
        raw
      ) as KVCorruptionLedgerRecord;

    } catch {

      return null;
    }
  }
}
