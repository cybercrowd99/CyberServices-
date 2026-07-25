/**
 * CyberServices Deployment Runtime Validator
 *
 * ONE JOB:
 * Validate deployment runtime records for structural correctness.
 *
 * Owns:
 * - Checking required runtime fields
 * - Checking runtime version compatibility
 * - Returning validation results
 *
 * Does NOT:
 * - Create runtimes
 * - Bind runtimes
 * - Register runtimes
 * - Deploy systems
 * - Execute operations
 * - Mutate runtime records
 */

import type {
  CyberServicesDeploymentRuntimeRecord,
  CyberServicesDeploymentRuntimeResult
} from "./CYBERSERVICES_DEPLOYMENT_RUNTIME_TYPES";


export class CyberServicesDeploymentRuntimeValidator {

  validate(
    runtime: CyberServicesDeploymentRuntimeRecord
  ): CyberServicesDeploymentRuntimeResult {

    const reasons: string[] = [];


    if (!runtime.identity.runtimeId) {
      reasons.push("MISSING_RUNTIME_ID");
    }


    if (!runtime.identity.version) {
      reasons.push("MISSING_VERSION");
    }


    if (runtime.identity.version !== "DR-1") {
      reasons.push("UNSUPPORTED_VERSION");
    }


    if (!runtime.deploymentId) {
      reasons.push("MISSING_DEPLOYMENT_ID");
    }


    if (!runtime.manifestId) {
      reasons.push("MISSING_MANIFEST_ID");
    }


    if (!runtime.createdAt) {
      reasons.push("MISSING_CREATED_AT");
    }


    return {
      success: reasons.length === 0,
      runtime
    };
  }
}
