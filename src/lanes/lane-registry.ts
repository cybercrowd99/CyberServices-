/**
 * CYBERCROWD — CYBERSERVICES
 *
 * PATH:
 * src/lanes/lane-registry.ts
 *
 * ONE JOB:
 * Maintain the declared CyberServices lane directory and provide
 * deterministic lane registration, lookup, and validation.
 *
 * OWNERSHIP:
 * - Lane registration
 * - Lane lookup
 * - Lane existence checks
 * - Lane enumeration
 *
 * THIS FILE MUST NEVER:
 * - Execute lane operations
 * - Resolve operation requests
 * - Invent lanes
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


export class LaneRegistry {

  private readonly lanes:
    Map<string, CSLane> =
      new Map();


  registerLane(
    lane: CSLane
  ): void {

    if (!lane.laneId) {
      throw new Error(
        "CyberServices laneId is required"
      );
    }


    const existing =
      this.lanes.get(
        lane.laneId
      );


    if (existing) {

      const sameLane =
        existing.laneType ===
          lane.laneType;


      if (!sameLane) {

        throw new Error(
          `CyberServices lane conflict: ${lane.laneId}`
        );
      }


      return;
    }


    this.lanes.set(
      lane.laneId,
      {
        ...lane,
        metadata:
          lane.metadata
            ? { ...lane.metadata }
            : undefined
      }
    );
  }


  getLane(
    laneId: string
  ): CSLane | null {

    const lane =
      this.lanes.get(
        laneId
      );


    if (!lane) {
      return null;
    }


    return {
      ...lane,
      metadata:
        lane.metadata
          ? { ...lane.metadata }
          : undefined
    };
  }


  validateLane(
    laneId: string
  ): boolean {

    return this.lanes.has(
      laneId
    );
  }


  listLanes():
    CSLane[] {

    return Array.from(
      this.lanes.values()
    )
      .map(
        lane => ({
          ...lane,
          metadata:
            lane.metadata
              ? { ...lane.metadata }
              : undefined
        })
      )
      .sort(
        (a, b) =>
          a.laneId.localeCompare(
            b.laneId
          )
      );
  }


  removeLane(
    laneId: string
  ): boolean {

    return this.lanes.delete(
      laneId
    );
  }


  clear(): void {

    this.lanes.clear();
  }
}


export const laneRegistry =
  new LaneRegistry();
