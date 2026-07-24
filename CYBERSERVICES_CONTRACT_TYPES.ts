/**
 * CyberServices Contract Types
 *
 * ONE JOB:
 * Define stable data contracts shared between CyberServices layers.
 *
 * Owns:
 * - Contract interfaces
 * - Contract version identifiers
 * - Shared contract shapes
 *
 * Does NOT:
 * - Validate contracts
 * - Transform data
 * - Route requests
 * - Execute services
 * - Deploy systems
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
