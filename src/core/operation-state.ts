/**
 * CYBERCROWD — CYBERSERVICES
 *
 * PATH:
 * src/core/operation-state.ts
 *
 * ONE JOB:
 * Apply one valid deterministic CS-1 operation state transition.
 *
 * THIS FILE MUST NEVER:
 * - Create initial operation state
 * - Detect terminal state
 * - Execute operations
 * - Resolve lanes
 * - Create CyberSeals
 * - Store MDC records
 * - Generate timestamps internally
 * - Invent lifecycle transitions
 */

export type CSOperationStatus =
  | "created"
  | "accepted"
  | "executing"
  | "completed"
  | "failed";


export interface CSOperationState {
  operationId: string;
  status: CSOperationStatus;
  updatedAt: string;
  metadata: Record<string, unknown>;
}


const VALID_TRANSITIONS:
  Record<
    CSOperationStatus,
    readonly CSOperationStatus[]
  > = {

  created: [
    "accepted",
    "failed"
  ],

  accepted: [
    "executing",
    "failed"
  ],

  executing: [
    "completed",
    "failed"
  ],

  completed: [],

  failed: []
};


export function transitionOperationState(
  state: CSOperationState,
  next: CSOperationStatus,
  updatedAt: string
): CSOperationState {

  const allowed =
    VALID_TRANSITIONS[
      state.status
    ].includes(next);


  if (!allowed) {
    throw new Error(
      `Invalid operation state transition: ${state.status} -> ${next}`
    );
  }


  return {
    ...state,
    status: next,
    updatedAt
  };
}
