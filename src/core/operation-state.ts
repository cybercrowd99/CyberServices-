/**
 * ============================================================
 * CyberServices Operation State
 * Deterministic CS-1 Lifecycle State Controller
 *
 * ONE JOB:
 * Define and control valid operation lifecycle states.
 *
 * Does NOT:
 * - execute operations
 * - resolve lanes
 * - create CyberSeals
 * - store MDC records
 * ============================================================
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
    operationId: string
  ): CSOperationState {

    return {
      operationId,

      status: "created",

      updatedAt:
        new Date().toISOString(),

      metadata: {}
    };
  }


  transition(
    state: CSOperationState,
    next: CSOperationStatus
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

      updatedAt:
        new Date().toISOString()
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


/*
   Default state controller instance
*/

export const operationState =
  new OperationStateController();
