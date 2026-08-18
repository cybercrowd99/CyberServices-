/**
 * CYBERCROWD — CYBERSERVICES
 *
 * PATH:
 * src/core/operation-context.ts
 *
 * ONE JOB:
 * Maintain the deterministic identity and execution context
 * of a CyberServices operation.
 *
 * OWNERSHIP:
 * - Operation identity context
 * - Caller-supplied creation timestamp
 * - Operation metadata envelope
 * - Context validation
 *
 * THIS FILE MUST NEVER:
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
  metadata?: Record<string, any>;
}


export interface CSOperationContext {
  operationId: string;
  laneId: string;
  actorId: string;
  createdAt: string;
  metadata: Record<string, any>;
}


export class OperationContext {

  create(
    input: CSOperationContextInput
  ): CSOperationContext {

    return {
      operationId: input.operationId,
      laneId: input.laneId,
      actorId: input.actorId,
      createdAt: input.createdAt,
      metadata:
        input.metadata ?? {}
    };
  }


  updateMetadata(
    context: CSOperationContext,
    metadata: Record<string, any>
  ): CSOperationContext {

    return {
      ...context,

      metadata: {
        ...context.metadata,
        ...metadata
      }
    };
  }


  validate(
    context: CSOperationContext
  ): boolean {

    return Boolean(
      context.operationId &&
      context.laneId &&
      context.actorId &&
      context.createdAt
    );
  }

}


export const operationContext =
  new OperationContext();
