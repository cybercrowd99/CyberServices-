/**
 * CyberServices Contract Validator
 *
 * ONE JOB:
 * Determine whether a CyberServices contract envelope satisfies contract rules.
 *
 * Owns:
 * - Checking required contract fields
 * - Checking contract version compatibility
 * - Returning validation results
 *
 * Does NOT:
 * - Adapt external input
 * - Route contracts
 * - Execute services
 * - Deploy contracts
 * - Mutate contract data
 */

import type {
  CyberServicesContractEnvelope,
  CyberServicesContractVersion
} from "./CYBERSERVICES_CONTRACT_TYPES";


export type CyberServicesContractValidationStatus =
  | "VALID"
  | "INVALID";


export interface CyberServicesContractValidationResult {
  status: CyberServicesContractValidationStatus;
  contractId: string;
  version: CyberServicesContractVersion | string;
  reasons: string[];
}


export class CyberServicesContractValidator {

  validate<T>(
    contract: CyberServicesContractEnvelope<T>
  ): CyberServicesContractValidationResult {

    const reasons: string[] = [];

    if (!contract.identity.contractId) {
      reasons.push("MISSING_CONTRACT_ID");
    }

    if (!contract.identity.version) {
      reasons.push("MISSING_VERSION");
    }

    if (!contract.createdAt) {
      reasons.push("MISSING_CREATED_AT");
    }

    if (contract.payload === undefined) {
      reasons.push("MISSING_PAYLOAD");
    }


    return {
      status: reasons.length === 0
        ? "VALID"
        : "INVALID",

      contractId: contract.identity.contractId,

      version: contract.identity.version,

      reasons
    };
  }
}
