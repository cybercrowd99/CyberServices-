/**
 * CyberServices Deployment Orchestration Types
 *
 * ONE JOB:
 * Define stable orchestration data contracts for deployment coordination.
 *
 * Owns:
 * - Orchestration identities
 * - Orchestration record shapes
 * - Orchestration status vocabulary
 *
 * Does NOT:
 * - Orchestrate deployments
 * - Trigger runtime actions
 * - Activate runtimes
 * - Deactivate runtimes
 * - Route operations
 * - Execute workflows
 * - Change deployment authority
 */

export type CyberServicesDeploymentOrchestrationStatus =
  | "CREATED"
  | "RUNNING"
  | "COMPLETED"
  | "FAILED";


export type CyberServicesDeploymentOrchestrationVersion =
  | "DO-1";


export interface CyberServicesDeploymentOrchestrationIdentity {
  orchestrationId: string;
  version: CyberServicesDeploymentOrchestrationVersion;
}


export interface CyberServicesDeploymentOrchestrationRecord {
  identity: CyberServicesDeploymentOrchestrationIdentity;
  deploymentId: string;
  runtimeId: string;
  status: CyberServicesDeploymentOrchestrationStatus;
  createdAt: string;
}


export interface CyberServicesDeploymentOrchestrationResult {
  success: boolean;
  orchestration:
    CyberServicesDeploymentOrchestrationRecord;
}
