/**
 * CYBERCROWD — CYBERSERVICES
 *
 * PATH:
 * src/lanes/lane-resolver.ts
 *
 * ONE JOB:
 * Resolve a declared CyberServices lane identifier into
 * a registered CSLane definition.
 *
 * OWNERSHIP:
 * - Lane lookup
 * - Lane existence checks
 * - Required-lane enforcement
 *
 * THIS FILE MUST NEVER:
 * - Register lanes
 * - Execute lane operations
 * - Invent lane IDs
 * - Route contracts
 * - Create authority
 * - Authenticate identity
 * - Authorize payments
 * - Mutate MDC metadata
 * - Write Ledger history
 */

import type {
  CSLane
} from "../protocol-spec";

import {
  LaneRegistry,
  laneRegistry
} from "./lane-registry";


export class LaneResolver {

  constructor(
    private readonly registry:
      LaneRegistry =
        laneRegistry
  ) {}


  resolve(
    laneId: string
  ): CSLane | null {

    return this.registry.getLane(
      laneId
    );
  }


  exists(
    laneId: string
  ): boolean {

    return this.registry.validateLane(
      laneId
    );
  }


  requireLane(
    laneId: string
  ): CSLane {

    const lane =
      this.resolve(
        laneId
      );


    if (!lane) {

      throw new Error(
        `CyberServices lane not found: ${laneId}`
      );
    }


    return lane;
  }
}


export const laneResolver =
  new LaneResolver();
