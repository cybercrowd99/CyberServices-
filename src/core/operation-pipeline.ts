/**
 * ============================================================
 * CyberServices Operation Pipeline
 * Deterministic CS-1 Operational Flow Controller
 * 
 * ONE JOB:
 * Connect CS-1 request handling to the Service Orchestrator.
 *
 * Does NOT:
 * - define lanes
 * - resolve lanes directly
 * - execute lane logic
 * - create CyberSeals
 * - manage adapters
 * ============================================================
 */

import {
  CSOperationRequest
} from "../protocol-spec";

import {
  ServiceOrchestrator,
  serviceOrchestrator,
  CSServiceExecutionResult
} from "./service-orchestrator";


export class OperationPipeline {

  private orchestrator: ServiceOrchestrator;


  constructor(
    orchestrator: ServiceOrchestrator = serviceOrchestrator
  ) {
    this.orchestrator = orchestrator;
  }


  process(
    request: CSOperationRequest
  ): CSServiceExecutionResult {

    return this.orchestrator.execute(
      request
    );
  }

}


/*
   Default pipeline instance

   Runtime entry point for operational flow.
*/

export const operationPipeline =
  new OperationPipeline();
