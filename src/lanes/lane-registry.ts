/**
 * ============================================================
 * CyberServices Lane Registry
 * Operational Lane Directory
 *
 * ONE JOB:
 * Maintain known CyberServices lanes and provide
 * deterministic lane lookup and validation.
 * ============================================================
 */

import { CSLane } from "../protocol-spec";


export class LaneRegistry {

  private lanes: Map<string, CSLane> = new Map();


  registerLane(
    lane: CSLane
  ): void {

    this.lanes.set(
      lane.laneId,
      lane
    );
  }


  getLane(
    laneId: string
  ): CSLane | null {

    return this.lanes.get(laneId) ?? null;
  }


  validateLane(
    laneId: string
  ): boolean {

    return this.lanes.has(laneId);
  }


  listLanes(): CSLane[] {

    return Array.from(
      this.lanes.values()
    );
  }


  removeLane(
    laneId: string
  ): boolean {

    return this.lanes.delete(laneId);
  }


  clear(): void {

    this.lanes.clear();
  }
}


/*
   Default registry instance

   The registry itself is intentionally empty.
   Lanes are registered by the deployment layer.
*/

export const laneRegistry = new LaneRegistry();
