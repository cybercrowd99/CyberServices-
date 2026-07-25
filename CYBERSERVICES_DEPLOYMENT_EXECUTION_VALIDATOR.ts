/**
 * CyberServices Deployment Execution Validator
 *
 * ONE JOB:
 * Validate deployment execution records for structural correctness.
 *
 * Owns:
 * - Checking required execution fields
 * - Checking execution version compatibility
 * - Returning validation results
 *
 * Does NOT:
 * - Create executions
 * - Execute operations
 * - Trigger runtimes
 * - Coordinate workflows
 * - Activate runtimes
 * - Deactivate runtimes
 * - Register executions
 * - Deploy systems
 * - Mutate execution records
 */

import type {
  CyberServicesDeploymentExecutionRecord,
  CyberServicesDeploymentExecutionResult
} from "./CYBERSERVICES_DEPLOYMENT_EXECUTION_TYPES";


export class CyberServicesDeploymentExecutionValidator {

  validate(
    execution: CyberServicesDeploymentExecutionRecord
  ): CyberServicesDeploymentExecutionResult {

    const reasons: string[] = [];


    if (!execution.identity.executionId) {
      reasons.push("MISSING_EXECUTION_ID");
    }


    if (!execution.identity.version) {
      reasons.push("MISSING_VERSION");
    }


    if (execution.identity.version !== "DE-1") {
      reasons.push("UNSUPPORTED_VERSION");
    }


    if (!execution.orchestrationId) {
      reasons.push("MISSING_ORCHESTRATION_ID");
    }


    if (!execution.runtimeId) {
      reasons.push("MISSING_RUNTIME_ID");
    }


    if (!execution.createdAt) {
      reasons.push("MISSING_CREATED_AT");
    }


    return {
      success: reasons.length === 0,
      execution
    };
  }
}
