/**
 * CYBERCROWD — CYBERSERVICES
 *
 * PATH:
 * CYBERSERVICES_CONTRACT_ADAPTER.ts
 *
 * ONE JOB:
 * Adapt external contract-shaped input into the normalized
 * CyberServices contract envelope.
 *
 * OWNERSHIP:
 * - Mapping incoming contract fields
 * - Creating normalized contract envelopes
 * - Preserving caller-supplied creation time
 *
 * THIS FILE MUST NEVER:
 * - Validate contract correctness
 * - Route operations
 * - Execute services
 * - Deploy systems
 * - Change contract authority
 * - Generate timestamps internally
 */

import type {
  CyberServicesContractEnvelope,
  CyberServicesContractIdentity,
  CyberServicesContractStatus
} from "./CYBERSERVICES_CONTRACT_TYPES";


export interface CyberServicesContractAdapterInput<T> {
  contractId: string;
  version: string;
  payload: T;
  createdAt: string;
}


export class CyberServicesContractAdapter {

  adapt<T>(
    input: CyberServicesContractAdapterInput<T>
  ): CyberServicesContractEnvelope<T> {

    const identity: CyberServicesContractIdentity = {
      contractId: input.contractId,
      version: input.version as "CS-1"
    };

    const status: CyberServicesContractStatus =
      "ACTIVE";

    return {
      identity,
      status,
      payload: input.payload,
      createdAt: input.createdAt
    };
  }
}
