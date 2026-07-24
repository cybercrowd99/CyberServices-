/**
 * CyberServices KV Corruption Pipeline
 *
 * ONE JOB:
 * Orchestrate the KV corruption chain:
 * Guard → Ledger → Response → Handler.
 *
 * Owns:
 * - Driving corruption events into the ledger
 * - Converting corruption evidence into responses
 * - Converting responses into handling actions
 *
 * Does NOT:
 * - Detect corruption
 * - Parse KV data
 * - Repair records
 * - Delete keys
 * - Change operation authority
 */

import type {
  KVCorruptionLedgerEvent,
  KVCorruptionLedgerRecord
} from "./CYBERSERVICES_KV_CORRUPTION_LEDGER";

import {
  CyberServicesKVCorruptionLedger
} from "./CYBERSERVICES_KV_CORRUPTION_LEDGER";

import type {
  KVCorruptionResponse,
  KVCorruptionResponseInput
} from "./CYBERSERVICES_KV_CORRUPTION_RESPONSE";

import {
  CyberServicesKVCorruptionResponse
} from "./CYBERSERVICES_KV_CORRUPTION_RESPONSE";

import type {
  KVCorruptionHandlingResult
} from "./CYBERSERVICES_KV_CORRUPTION_HANDLER";

import {
  CyberServicesKVCorruptionHandler
} from "./CYBERSERVICES_KV_CORRUPTION_HANDLER";


export class CyberServicesKVCorruptionPipeline {

  constructor(
    private readonly ledger: CyberServicesKVCorruptionLedger,
    private readonly response: CyberServicesKVCorruptionResponse,
    private readonly handler: CyberServicesKVCorruptionHandler
  ) {}


  async processCorruption(
    event: KVCorruptionLedgerEvent
  ): Promise<{
    record: KVCorruptionLedgerRecord;
    response: KVCorruptionResponse;
    handling: KVCorruptionHandlingResult;
  }> {

    const record = await this.ledger.record(event);

    const responseInput: KVCorruptionResponseInput = {
      key: event.key,
      reason: event.reason,
      timestamp: event.timestamp,
      state: "CORRUPTION_DETECTED"
    };

    const response = this.response.respond(
      responseInput
    );

    const handling = this.handler.handle(
      response
    );

    return {
      record,
      response,
      handling
    };
  }


  processUnavailable(
    key: string
  ): {
    response: KVCorruptionResponse;
    handling: KVCorruptionHandlingResult;
  } {

    const response = this.response.unavailable(
      key
    );

    const handling = this.handler.handle(
      response
    );

    return {
      response,
      handling
    };
  }


  processSafeContinue(
    key?: string
  ): {
    response: KVCorruptionResponse;
    handling: KVCorruptionHandlingResult;
  } {

    const response = key
      ? this.response.respond({
          key,
          reason: "VALID_RECORD",
          timestamp: new Date().toISOString(),
          state: "SAFE_CONTINUE"
        })
      : this.response.continue();


    const handling = this.handler.handle(
      response
    );

    return {
      response,
      handling
    };
  }
}
