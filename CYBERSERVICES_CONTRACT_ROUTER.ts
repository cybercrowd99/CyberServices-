/**
 * CyberServices Contract Router
 *
 * ONE JOB:
 * Route validated contracts to their declared service destination.
 *
 * Owns:
 * - Mapping validated contract identity to route targets
 * - Returning deterministic route decisions
 *
 * Does NOT:
 * - Validate contracts
 * - Adapt contract shapes
 * - Execute services
 * - Deploy systems
 * - Modify contract payloads
 */

import type {
  CyberServicesContractEnvelope
} from "./CYBERSERVICES_CONTRACT_TYPES";


export interface CyberServicesRouteResult {
  routed: boolean;
  contractId: string;
  service: string;
  route: string;
}


export class CyberServicesContractRouter {

  route<T>(
    contract: CyberServicesContractEnvelope<T>,
    serviceRoutes: Record<string, string>
  ): CyberServicesRouteResult {

    const service =
      contract.payload &&
      typeof contract.payload === "object" &&
      "service" in contract.payload
        ? String(
            (contract.payload as Record<string, unknown>)
              .service
          )
        : "";


    const route =
      serviceRoutes[service];


    return {
      routed: Boolean(route),
      contractId: contract.identity.contractId,
      service,
      route: route ?? ""
    };
  }
}
