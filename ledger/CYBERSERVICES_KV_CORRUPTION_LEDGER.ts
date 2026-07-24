/**
 * CyberServices KV Corruption Ledger
 *
 * ONE JOB:
 * Preserve corruption events as immutable operational evidence.
 *
 * Owns:
 * - Accepting corruption events
 * - Creating ledger records
 * - Providing read access to corruption history
 *
 * Does NOT:
 * - Detect corruption
 * - Parse KV
 * - Repair records
 * - Delete keys
 * - Change operation state
 */

export interface KVCorruptionLedgerEvent {
  key: string;
  reason: string;
  timestamp: string;
  rawLength: number;
}

export interface KVCorruptionLedgerRecord {
  id: string;
  type: "KV_CORRUPTION";
  createdAt: string;
  event: KVCorruptionLedgerEvent;
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
    private store: KVCorruptionLedgerStore
  ) {}

  async record(
    event: KVCorruptionLedgerEvent
  ): Promise<KVCorruptionLedgerRecord> {

    const record: KVCorruptionLedgerRecord = {
      id: crypto.randomUUID(),
      type: "KV_CORRUPTION",
      createdAt: new Date().toISOString(),
      event
    };

    await this.store.put(
      `corruption:${record.id}`,
      JSON.stringify(record)
    );

    return record;
  }


  async get(
    id: string
  ): Promise<KVCorruptionLedgerRecord | null> {

    const raw = await this.store.get(
      `corruption:${id}`
    );

    if (!raw) {
      return null;
    }

    return JSON.parse(raw);
  }
}
