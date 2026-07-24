/**
 * CyberServices KV Corruption Service
 *
 * ONE JOB:
 * Provide a single service entry point for KV corruption handling.
 *
 * Owns:
 * - Accepting external corruption handling requests
 * - Passing requests into the corruption pipeline
 * - Returning pipeline results
 *
 * Does NOT:
 * - Detect corruption
 * - Parse KV values
 * - Write ledger records directly
 * - Repair records
 * - Delete keys
 * - Change operation authority
 */

import type {
  KVCorruptionLedgerEvent
} from "./CYBERSERVICES_KV_CORRUPTION_LEDGER";

import type {
  KVCorruptionPipelineResult
} from "./CYBERSERVICES_KV_CORRUPTION_PIPELINE";

import {
  CyberServicesKVCorruptionPipeline
} from "./CYBERSERVICES_KV_CORRUPTION_PIPELINE";


export class CyberServicesKVCorruptionService {

  constructor(
    private readonly pipeline: CyberServicesKVCorruptionPipeline
  ) {}


  async handleCorruption(
    event: KVCorruptionLedgerEvent
  ) {

    return await this.pipeline.processCorruption(
      event
    );
  }


  handleUnavailable(
    key: string
  ) {

    return this.pipeline.processUnavailable(
      key
    );
  }


  handleSafeContinue(
    key?: string
  ) {

    return this.pipeline.processSafeContinue(
      key
    );
  }
}
