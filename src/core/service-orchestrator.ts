/**
 * CYBERCROWD — CYBERSERVICES
 *
 * PATH:
 * src/core/service-orchestrator.ts
 *
 * ONE JOB:
 * Coordinate a CyberServices operation by delegating execution
 * to the CyberServicesOperationExecutor.
 *
 * OWNERSHIP:
 * - Operational coordination
 * - Delegation to the operation executor
 * - CyberServices service-layer result metadata
 *
 * THIS FILE MUST NEVER:
 * - Define lanes
 * - Register lanes
 * - Resolve lanes directly
 * - Execute lane internals
 * - Create CyberSeals
 * - Manage external adapters
 * - Duplicate executor responsibilities
 */

import type {
  CSOperationRequest,
  CSServiceExecutionResult,
} from "../protocol-spec";

import CyberServicesOperationExecutor
  from "../../CYBERSERVICES_OPERATION_EXECUTOR";


export class ServiceOrchestrator {

  private readonly executor:
    CyberServicesOperationExecutor;


  constructor(
    executor:
      CyberServicesOperationExecutor =
        new CyberServicesOperationExecutor()
  ) {
    this.executor = executor;
  }


  async execute(
    request: CSOperationRequest
  ): Promise<CSServiceExecutionResult> {

    const result =
      await this.executor.execute(
        request
      );


    return {
      ...result,

      resultMetadata: {
        ...result.resultMetadata,
        serviceLayer: "CyberServices"
      }
    };
  }

}


export const serviceOrchestrator =
  new ServiceOrchestrator();
