/**
 * CYBERCROWD — CYBERSERVICES
 *
 * PATH:
 * CYBERSERVICES_CONTRACT_VALIDATOR.ts
 *
 * ONE JOB:
 * Determine whether a CyberServices contract envelope satisfies
 * the declared CS-1 contract rules.
 *
 * OWNERSHIP:
 * - Required contract field checks
 * - Supported contract version checks
 * - Contract status checks
 * - Deterministic validation result return
 *
 * THIS FILE MUST NEVER:
 * - Adapt external input
 * - Route contracts
 * - Execute services
 * - Deploy contracts
 * - Mutate contract data
 * - Invent contract authority
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


const SUPPORTED_VERSIONS:
  readonly CyberServicesContractVersion[] = [
    "CS-1"
  ];


export class CyberServicesContractValidator {

  validate<T>(
    contract: CyberServicesContractEnvelope<T>
  ): CyberServicesContractValidationResult {

    const reasons: string[] = [];


    if (
      !contract.identity ||
      !contract.identity.contractId
    ) {
      reasons.push(
        "MISSING_CONTRACT_ID"
      );
    }


    if (
      !contract.identity ||
      !contract.identity.version
    ) {
      reasons.push(
        "MISSING_VERSION"
      );
    }


    if (
      contract.identity?.version &&
      !SUPPORTED_VERSIONS.includes(
        contract.identity.version
      )
    ) {
      reasons.push(
        "UNSUPPORTED_VERSION"
      );
    }


    if (!contract.createdAt) {
      reasons.push(
        "MISSING_CREATED_AT"
      );
    }


    if (
      contract.status !== "ACTIVE"
    ) {
      reasons.push(
        "CONTRACT_NOT_ACTIVE"
      );
    }


    if (
      contract.payload === undefined
    ) {
      reasons.push(
        "MISSING_PAYLOAD"
      );
    }


    return {
      status:
        reasons.length === 0
          ? "VALID"
          : "INVALID",

      contractId:
        contract.identity?.contractId ?? "",

      version:
        contract.identity?.version ?? "",

      reasons
    };
  }
}
