/**
 * CYBERCROWD — CYBERSERVICES
 *
 * PATH:
 * src/core/operation-context.ts
 *
 * ONE JOB:
 * Create the deterministic context for one CyberServices operation.
 *
 * THIS FILE MUST NEVER:
 * - Update metadata
 * - Validate context
 * - Execute operations
 * - Resolve lanes
 * - Create CyberSeals
 * - Store MDC records
 * - Generate timestamps internally
 * - Create authority
 */

export interface CSOperationContextInput {
  operationId: string;
  laneId: string;
  actorId: string;
  createdAt: string;
  metadata?: Record<string, unknown>;
}

export interface CSOperationContext {
  operationId: string;
  laneId: string;
  actorId: string;
  createdAt: string;
  metadata: Record<string, unknown>;
}

export function createOperationContext(
  input: CSOperationContextInput
): CSOperationContext {
  return {
    operationId: input.operationId,
    laneId: input.laneId,
    actorId: input.actorId,
    createdAt: input.createdAt,
    metadata: {
      ...(input.metadata ?? {})
    }
  };
}
