/**
 * CYBERCROWD — CYBERSERVICES
 *
 * PATH:
 * CYBERSERVICES_OPERATION_EXECUTOR.ts
 *
 * ONE JOB:
 * Execute an already-routed CyberServices contract through an
 * already-registered CyberServices lane.
 *
 * OWNERSHIP:
 * - Contract-to-lane execution handoff
 * - Declared service/lane extraction
 * - Lane resolution
 * - Delegation to the existing LaneExecutor
 * - Deterministic execution-result return
 *
 * THIS FILE MUST NEVER:
 * - Adapt contracts
 * - Validate contracts
 * - Register lanes
 * - Invent routes
 * - Create authority
 * - Authenticate identity
 * - Authorize payments
 * - Mutate MDC metadata
 * - Write ledger history
 * - Call external providers
 * - Absorb CORE, NET, MDC, CCF, or Ledger responsibilities
 */

import type {
  CSOperationRequest,
  CSServiceExecutionResult,
} from "./protocol-spec";

import {
  LaneExecutor,
  default as laneExecutor,
} from "./lanes/lane-executor";

import {
  LaneResolver,
  default as laneResolver,
} from "./lanes/lane-resolver";

/**
 * Execute an already-routed CyberServices operation.
 *
 * This class does not validate or reinterpret the operation.
 * It resolves the declared lane and delegates execution to the
 * existing LaneExecutor.
 */
export class CyberServicesOperationExecutor {
  constructor(
    private readonly resolver: LaneResolver = laneResolver,
    private readonly executor: LaneExecutor = laneExecutor,
  ) {}

  async execute(
    request: CSOperationRequest,
  ): Promise<CSServiceExecutionResult> {
    const lane = this.resolver.requireLane(request.laneId);

    const result = await this.executor.execute({
      lane,
      payload: request.payload,
      metadata: request.metadata,
    });

    return {
      operationId: request.operationId,
      laneId: result.laneId,
      resultPayload: result.resultPayload,
      resultMetadata: result.resultMetadata,
    };
  }
}

export default CyberServicesOperationExecutor;
