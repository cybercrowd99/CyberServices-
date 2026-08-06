/**
 * ============================================================
 * CyberServices Operation Context
 * Deterministic Execution Context Envelope
 * 
 * ONE JOB:
 * Maintain the identity and state context of an operation
 * while it moves through the CyberServices execution pipeline.
 *
 * Does NOT:
 * - execute operations
 * - resolve lanes
 * - create CyberSeals
 * - store MDC records
 * ============================================================
 */


export interface CSOperationContextInput {
  operationId: string;
  laneId: string;
  actorId: string;

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

      createdAt:
        new Date().toISOString(),

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
      context.actorId
    );
  }

}


/*
   Default context factory instance
*/

export const operationContext =
  new OperationContext();
