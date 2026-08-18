/**
 * CYBERCROWD — CYBERSERVICES
 *
 * PATH:
 * CYBERSERVICES_CONTRACT_TYPES.ts
 *
 * ONE JOB:
 * Define stable shared contract types for the CyberServices
 * deterministic contract path.
 *
 * OWNERSHIP:
 * - Contract version identifiers
 * - Contract status identifiers
 * - Contract identity shape
 * - Contract envelope shape
 * - Operation contract shape
 * - Contract result shape
 *
 * THIS FILE MUST NEVER:
 * - Validate contracts
 * - Transform data
 * - Route requests
 * - Execute services
 * - Deploy systems
 * - Generate timestamps
 * - Create authority
 */

export type CyberServicesContractVersion =
  | "CS-1";


export type CyberServicesContractStatus =
  | "ACTIVE"
  | "DEPRECATED"
  | "INVALID";


export interface CyberServicesContractIdentity {
  contractId: string;
  version: CyberServicesContractVersion;
}


export interface CyberServicesContractEnvelope<T> {
  identity: CyberServicesContractIdentity;
  status: CyberServicesContractStatus;
  payload: T;
  createdAt: string;
}


export interface CyberServicesOperationContract {
  operationId: string;
  service: string;
  intent: string;
  createdAt: string;
}


export interface CyberServicesContractResult<T> {
  success: boolean;
  contract: CyberServicesContractEnvelope<T>;
}
