/**
 * ============================================================
 * CyberServices Lane Resolver
 * Deterministic Lane Resolution Layer
 *
 * ONE JOB:
 * Resolve a lane request into a registered CSLane definition.
 * ============================================================
 */

import { CSLane } from "../protocol-spec";
import { laneRegistry } from "./lane-registry";


export class LaneResolver {


  resolve(
    laneId: string
  ): CSLane | null {

    return laneRegistry.getLane(laneId);
  }


  exists(
    laneId: string
  ): boolean {

    return laneRegistry.validateLane(laneId);
  }


  requireLane(
    laneId: string
  ): CSLane {

    const lane = this.resolve(laneId);

    if (!lane) {
      throw new Error(
        `CyberServices lane not found: ${laneId}`
      );
    }

    return lane;
  }

}


/*
   Default resolver instance

   Stateless resolver using the shared lane registry.
*/

export const laneResolver = new LaneResolver();
