/**
 * ============================================================
 * CyberServices Service Orchestrator
 * Deterministic Operational Coordination Layer
 *
 * ONE JOB:
 * Coordinate a CyberServices operation from request
 * to resolved lane execution.
 *
 * Does NOT:
 * - define lanes
 * - register lanes
 * - execute lane internals
 * - create CyberSeals
 * - manage external adapters
 * ============================================================
 */

import {
  CSOperationRequest
} from "../protocol-spec";

import {
  LaneResolver,
  laneResolver
} from "../lanes/lane-resolver";

import {
  LaneExecutor,
  laneExecutor
} from "../lanes/lane-executor";


export interface CSServiceExecutionResult {
  operationId: string;
  laneId: string;
  resultPayload: unknown;
  resultMetadata: Record<string, any>;
}


export class ServiceOrchestrator {

  private resolver: LaneResolver;
  private executor: LaneExecutor;


  constructor(
    resolver: LaneResolver = laneResolver,
    executor: LaneExecutor = laneExecutor
  ) {
    this.resolver = resolver;
    this.executor = executor;
  }


  execute(
    request: CSOperationRequest
  ): CSServiceExecutionResult {

    const lane =
      this.resolver.requireLane(
        request.laneId
      );


    const result =
      this.executor.execute({
        lane,
        payload: request.payload,
        metadata: request.metadata
      });


    return {
      operationId: request.operationId,
      laneId: result.laneId,

      resultPayload:
        result.resultPayload,

      resultMetadata: {
        ...result.resultMetadata,
        serviceLayer: "CyberServices"
      }
    };
  }

}


/*
   Default orchestrator instance
*/

export const serviceOrchestrator =
  new ServiceOrchestrator();
