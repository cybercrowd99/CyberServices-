/**
 * CYBERCROWD — CYBERSERVICES
 *
 * PATH:
 * src/core/operation-state.ts
 *
 * ONE JOB:
 * Define and control valid deterministic CS-1 operation
 * lifecycle state transitions.
 *
 * OWNERSHIP:
 * - Operation lifecycle states
 * - Valid transition enforcement
 * - Caller-supplied transition timestamps
 * - Terminal-state detection
 *
 * THIS FILE MUST NEVER:
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
  metadata: Record<string, any>;
}


const VALID_TRANSITIONS:
  Record<CSOperationStatus, CSOperationStatus[]> = {

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


export class OperationStateController {

  create(
    operationId: string,
    updatedAt: string
  ): CSOperationState {

    return {
      operationId,
      status: "created",
      updatedAt,
      metadata: {}
    };
  }


  transition(
    state: CSOperationState,
    next: CSOperationStatus,
    updatedAt: string
  ): CSOperationState {

    const allowed =
      VALID_TRANSITIONS[state.status]
        .includes(next);


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


  isTerminal(
    state: CSOperationState
  ): boolean {

    return (
      state.status === "completed" ||
      state.status === "failed"
    );
  }

}


export const operationState =
  new OperationStateController();
