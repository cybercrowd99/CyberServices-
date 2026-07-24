/**
 * CyberServices KV Corruption Response
 *
 * ONE JOB:
 * Convert KV corruption events into deterministic response signals.
 *
 * Owns:
 * - Mapping corruption evidence into response states
 * - Providing safe downstream signals
 *
 * Does NOT:
 * - Detect corruption
 * - Parse KV data
 * - Repair records
 * - Delete keys
 * - Write ledger records
 * - Change operation authority
 */

export type KVCorruptionResponseState =
  | "CORRUPTION_DETECTED"
  | "RECORD_UNAVAILABLE"
  | "SAFE_CONTINUE";

export interface KVCorruptionResponseInput {
  key: string;
  reason: string;
  timestamp: string;
}

export interface KVCorruptionResponse {
  state: KVCorruptionResponseState;
  key: string;
  reason: string;
  timestamp: string;
}


export class CyberServicesKVCorruptionResponse {

  respond(
    input: KVCorruptionResponseInput
  ): KVCorruptionResponse {

    return {
      state: "CORRUPTION_DETECTED",
      key: input.key,
      reason: input.reason,
      timestamp: input.timestamp
    };
  }


  unavailable(
    key: string
  ): KVCorruptionResponse {

    return {
      state: "RECORD_UNAVAILABLE",
      key,
      reason: "NO_VALID_RECORD",
      timestamp: new Date().toISOString()
    };
  }


  continue(): KVCorruptionResponse {

    return {
      state: "SAFE_CONTINUE",
      key: "",
      reason: "VALID_RECORD",
      timestamp: new Date().toISOString()
    };
  }
}
