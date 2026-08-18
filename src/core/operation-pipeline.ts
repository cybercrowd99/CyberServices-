/**
 * CYBERCROWD — CYBERSERVICES
 *
 * PATH:
 * src/core/operation-pipeline.ts
 *
 * ONE JOB:
 * Pass one CS-1 operation request into the CyberServices
 * service-orchestration function.
 *
 * THIS FILE MUST NEVER:
 * - Define lanes
 * - Register lanes
 * - Resolve lanes directly
 * - Execute lane internals
 * - Create CyberSeals
 * - Manage external adapters
 * - Own orchestrator lifecycle
 * - Duplicate orchestrator responsibilities
 */

import type {
  CSOperationRequest,
  CSServiceExecutionResult
} from "../protocol-spec";

import {
  orchestrateServiceOperation
} from "./service-orchestrator";


export async function processOperation(
  request: CSOperationRequest
): Promise<CSServiceExecutionResult> {

  return orchestrateServiceOperation(
    request
  );
}
