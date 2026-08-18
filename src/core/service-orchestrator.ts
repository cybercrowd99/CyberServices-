/**
 * CYBERCROWD — CYBERSERVICES
 *
 * PATH:
 * src/core/service-orchestrator.ts
 *
 * ONE JOB:
 * Delegate one CyberServices operation to the
 * CyberServicesOperationExecutor and return the service-layer result.
 *
 * THIS FILE MUST NEVER:
 * - Define lanes
 * - Register lanes
 * - Resolve lanes directly
 * - Execute lane internals
 * - Create CyberSeals
 * - Manage external adapters
 * - Own executor lifecycle
 * - Duplicate executor responsibilities
 */

import type {
  CSOperationRequest,
  CSServiceExecutionResult
} from "../protocol-spec";

import CyberServicesOperationExecutor
  from "../../CYBERSERVICES_OPERATION_EXECUTOR";


export async function orchestrateServiceOperation(
  request: CSOperationRequest
): Promise<CSServiceExecutionResult> {

  const executor =
    new CyberServicesOperationExecutor();

  const result =
    await executor.execute(
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
