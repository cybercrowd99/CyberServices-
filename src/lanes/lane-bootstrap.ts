/**
 * CYBERCROWD — CYBERSERVICES
 *
 * PATH:
 * src/lanes/lane-bootstrap.ts
 *
 * ONE JOB:
 * Register the declared CyberServices CS-1 lanes into the shared
 * lane registry before runtime execution begins.
 *
 * OWNERSHIP:
 * - Declared CyberServices startup lane definitions
 * - Deterministic lane registration
 * - Idempotent CyberServices lane bootstrap
 *
 * THIS FILE MUST NEVER:
 * - Execute lane operations
 * - Resolve operation requests
 * - Route contracts
 * - Create CyberSeals
 * - Create authority
 * - Authenticate identity
 * - Authorize payments
 * - Call external providers
 * - Mutate MDC metadata
 * - Write Ledger history
 * - Dynamically invent lanes from incoming requests
 * - Absorb CORE, NET, MDC, CCF, or Ledger responsibilities
 */

import type {
  CSLane
} from "../protocol-spec";

import {
  laneRegistry
} from "./lane-registry";


export const CYBERSERVICES_DECLARED_LANES:
  readonly CSLane[] = [

  {
    laneId: "identity",
    laneType: "IDENTITY"
  },

  {
    laneId: "supply-chain",
    laneType: "SUPPLY_CHAIN"
  },

  {
    laneId: "physical-shipping",
    laneType: "PHYSICAL_SHIPPING"
  },

  {
    laneId: "digital-assets",
    laneType: "DIGITAL_ASSETS"
  },

  {
    laneId: "qr",
    laneType: "QR"
  },

  {
    laneId: "mesh",
    laneType: "MESH"
  },

  {
    laneId: "documents",
    laneType: "DOCUMENTS"
  },

  {
    laneId: "media",
    laneType: "MEDIA"
  }
];


export function bootstrapCyberServicesLanes():
  void {

  for (
    const lane of
    CYBERSERVICES_DECLARED_LANES
  ) {

    laneRegistry.registerLane(
      lane
    );
  }
}


export function getBootstrappedCyberServicesLanes():
  CSLane[] {

  return laneRegistry.listLanes();
}
