/**
 * CYBERCROWD — CYBERSERVICES
 *
 * PATH:
 * CYBERSERVICES_CONTRACT_ROUTER.ts
 *
 * ONE JOB:
 * Route a validated CyberServices contract to its explicitly
 * declared service destination.
 *
 * OWNERSHIP:
 * - Reading the declared service identifier
 * - Resolving declared service routes
 * - Returning deterministic route decisions
 *
 * THIS FILE MUST NEVER:
 * - Validate contracts
 * - Adapt contract shapes
 * - Execute services
 * - Deploy systems
 * - Modify contract payloads
 * - Invent service names
 * - Invent route targets
 * - Create authority
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

    const payload =
      contract.payload;


    const service =
      payload !== null &&
      typeof payload === "object" &&
      "service" in payload &&
      typeof (
        payload as Record<string, unknown>
      ).service === "string"
        ? (
            payload as Record<string, string>
          ).service
        : "";


    const route =
      service
        ? serviceRoutes[service]
        : undefined;


    return {
      routed:
        typeof route === "string" &&
        route.length > 0,

      contractId:
        contract.identity.contractId,

      service,

      route:
        route ?? ""
    };
  }
}
