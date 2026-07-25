/**
 * CyberServices Deployment Orchestration Validator
 *
 * ONE JOB:
 * Validate deployment orchestration records for structural correctness.
 *
 * Owns:
 * - Checking required orchestration fields
 * - Checking orchestration version compatibility
 * - Returning validation results
 *
 * Does NOT:
 * - Create orchestrations
 * - Execute workflows
 * - Trigger runtime actions
 * - Activate runtimes
 * - Deactivate runtimes
 * - Register orchestrations
 * - Deploy systems
 * - Mutate orchestration records
 */

import type {
  CyberServicesDeploymentOrchestrationRecord,
  CyberServicesDeploymentOrchestrationResult
} from "./CYBERSERVICES_DEPLOYMENT_ORCHESTRATION_TYPES";


export class CyberServicesDeploymentOrchestrationValidator {

  validate(
    orchestration: CyberServicesDeploymentOrchestrationRecord
  ): CyberServicesDeploymentOrchestrationResult {

    const reasons: string[] = [];


    if (!orchestration.identity.orchestrationId) {
      reasons.push("MISSING_ORCHESTRATION_ID");
    }


    if (!orchestration.identity.version) {
      reasons.push("MISSING_VERSION");
    }


    if (orchestration.identity.version !== "DO-1") {
      reasons.push("UNSUPPORTED_VERSION");
    }


    if (!orchestration.deploymentId) {
      reasons.push("MISSING_DEPLOYMENT_ID");
    }


    if (!orchestration.runtimeId) {
      reasons.push("MISSING_RUNTIME_ID");
    }


    if (!orchestration.createdAt) {
      reasons.push("MISSING_CREATED_AT");
    }


    return {
      success: reasons.length === 0,
      orchestration
    };
  }
}
