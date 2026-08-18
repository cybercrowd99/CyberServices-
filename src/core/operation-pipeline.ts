/**
 * CYBERCROWD — CYBERSERVICES
 *
 * PATH:
 * src/core/operation-pipeline.ts
 *
 * ONE JOB:
 * Connect a CS-1 operation request to the CyberServices
 * ServiceOrchestrator.
 *
 * OWNERSHIP:
 * - Operational pipeline handoff
 * - Delegation to ServiceOrchestrator
 * - Runtime pipeline entry point
 *
 * THIS FILE MUST NEVER:
 * - Define lanes
 * - Register lanes
 * - Resolve lanes directly
 * - Execute lane internals
 * - Create CyberSeals
 * - Manage external adapters
 * - Duplicate orchestrator responsibilities
 */

import type {
  CSOperationRequest,
  CSServiceExecutionResult,
} from "../protocol-spec";

import {
  ServiceOrchestrator,
  serviceOrchestrator,
} from "./service-orchestrator";


export class OperationPipeline {

  private readonly orchestrator:
    ServiceOrchestrator;


  constructor(
    orchestrator:
      ServiceOrchestrator =
        serviceOrchestrator
  ) {
    this.orchestrator = orchestrator;
  }


  async process(
    request: CSOperationRequest
  ): Promise<CSServiceExecutionResult> {

    return this.orchestrator.execute(
      request
    );
  }

}


export const operationPipeline =
  new OperationPipeline();
