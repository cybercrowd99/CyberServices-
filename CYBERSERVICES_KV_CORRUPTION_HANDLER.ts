/**
 * CyberServices KV Corruption Handler
 *
 * ONE JOB:
 * Convert KV corruption response signals into safe handling actions.
 *
 * Owns:
 * - Mapping response states into handling actions
 *
 * Does NOT:
 * - Detect corruption
 * - Parse KV data
 * - Write ledger records
 * - Repair records
 * - Delete keys
 * - Change operation authority
 * - Produce responses
 */

import type {
  KVCorruptionResponse
} from "./CYBERSERVICES_KV_CORRUPTION_RESPONSE";


export type KVCorruptionHandlingAction =
  | "STOP_OPERATION"
  | "ALLOW_CONTINUE"
  | "NO_RECORD";


export interface KVCorruptionHandlingResult {
  action: KVCorruptionHandlingAction;
  key: string;
  reason: string;
  timestamp: string;
}


export class CyberServicesKVCorruptionHandler {

  handle(
    response: KVCorruptionResponse
  ): KVCorruptionHandlingResult {

    switch (response.state) {

      case "CORRUPTION_DETECTED":
        return {
          action: "STOP_OPERATION",
          key: response.key,
          reason: response.reason,
          timestamp: response.timestamp
        };


      case "RECORD_UNAVAILABLE":
        return {
          action: "NO_RECORD",
          key: response.key,
          reason: response.reason,
          timestamp: response.timestamp
        };


      case "SAFE_CONTINUE":
        return {
          action: "ALLOW_CONTINUE",
          key: response.key,
          reason: response.reason,
          timestamp: response.timestamp
        };


      default:
        return {
          action: "STOP_OPERATION",
          key: response.key,
          reason: "UNKNOWN_RESPONSE_STATE",
          timestamp: new Date().toISOString()
        };
    }
  }
}
