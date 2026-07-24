/**
 * CyberServices Deployment Proof Types
 *
 * ONE JOB:
 * Define stable deployment proof data contracts.
 *
 * Owns:
 * - Proof identities
 * - Proof record shapes
 * - Proof status vocabulary
 *
 * Does NOT:
 * - Create proofs
 * - Validate proofs
 * - Build manifests
 * - Deploy systems
 * - Execute operations
 */

export type CyberServicesDeploymentProofStatus =
  | "CREATED"
  | "VERIFIED"
  | "REJECTED";


export type CyberServicesDeploymentProofVersion =
  | "DP-1";


export interface CyberServicesDeploymentProofIdentity {
  proofId: string;
  version: CyberServicesDeploymentProofVersion;
}


export interface CyberServicesDeploymentProofRecord {
  identity: CyberServicesDeploymentProofIdentity;
  status: CyberServicesDeploymentProofStatus;
  deploymentId: string;
  contractId: string;
  createdAt: string;
}


export interface CyberServicesDeploymentProofResult {
  valid: boolean;
  proof: CyberServicesDeploymentProofRecord;
}
