/**
 * CyberServices Deployment Execution Types
 *
 * ONE JOB:
 * Define stable execution data contracts for deployment operations.
 *
 * Owns:
 * - Execution identities
 * - Execution record shapes
 * - Execution status vocabulary
 *
 * Does NOT:
 * - Execute operations
 * - Trigger runtimes
 * - Coordinate workflows
 * - Activate runtimes
 * - Deactivate runtimes
 * - Deploy systems
 * - Change deployment authority
 */

export type CyberServicesDeploymentExecutionStatus =
  | "CREATED"
  | "QUEUED"
  | "RUNNING"
  | "COMPLETED"
  | "FAILED";


export type CyberServicesDeploymentExecutionVersion =
  | "DE-1";


export interface CyberServicesDeploymentExecutionIdentity {
  executionId: string;
  version: CyberServicesDeploymentExecutionVersion;
}


export interface CyberServicesDeploymentExecutionRecord {
  identity: CyberServicesDeploymentExecutionIdentity;
  orchestrationId: string;
  runtimeId: string;
  status: CyberServicesDeploymentExecutionStatus;
  createdAt: string;
}


export interface CyberServicesDeploymentExecutionResult {
  success: boolean;
  execution: CyberServicesDeploymentExecutionRecord;
}
