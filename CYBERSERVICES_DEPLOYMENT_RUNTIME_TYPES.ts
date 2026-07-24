/**
 * CyberServices Deployment Runtime Types
 *
 * ONE JOB:
 * Define stable runtime deployment data contracts.
 *
 * Owns:
 * - Runtime identities
 * - Runtime record shapes
 * - Runtime status vocabulary
 *
 * Does NOT:
 * - Bind runtimes
 * - Validate runtimes
 * - Register runtimes
 * - Execute operations
 * - Change deployment authority
 */

export type CyberServicesDeploymentRuntimeStatus =
  | "CREATED"
  | "BOUND"
  | "ACTIVE"
  | "DISABLED";


export type CyberServicesDeploymentRuntimeVersion =
  | "DR-1";


export interface CyberServicesDeploymentRuntimeIdentity {
  runtimeId: string;
  version: CyberServicesDeploymentRuntimeVersion;
}


export interface CyberServicesDeploymentRuntimeRecord {
  identity: CyberServicesDeploymentRuntimeIdentity;
  status: CyberServicesDeploymentRuntimeStatus;
  deploymentId: string;
  manifestId: string;
  createdAt: string;
}


export interface CyberServicesDeploymentRuntimeResult {
  success: boolean;
  runtime: CyberServicesDeploymentRuntimeRecord;
}
