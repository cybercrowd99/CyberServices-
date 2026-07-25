/**
 * CyberServices Deployment Deactivation Validator
 *
 * ONE JOB:
 * Validate deployment deactivation records for structural correctness.
 *
 * Owns:
 * - Checking required deactivation fields
 * - Checking deactivation version compatibility
 * - Returning validation results
 *
 * Does NOT:
 * - Create deactivations
 * - Deactivate runtimes
 * - Bind runtimes
 * - Register deactivations
 * - Deploy systems
 * - Execute operations
 * - Mutate deactivation records
 */

import type {
  CyberServicesDeploymentDeactivationRecord,
  CyberServicesDeploymentDeactivationResult
} from "./CYBERSERVICES_DEPLOYMENT_DEACTIVATION_TYPES";


export class CyberServicesDeploymentDeactivationValidator {

  validate(
    deactivation: CyberServicesDeploymentDeactivationRecord
  ): CyberServicesDeploymentDeactivationResult {

    const reasons: string[] = [];


    if (!deactivation.identity.deactivationId) {
      reasons.push("MISSING_DEACTIVATION_ID");
    }


    if (!deactivation.identity.version) {
      reasons.push("MISSING_VERSION");
    }


    if (deactivation.identity.version !== "DD-1") {
      reasons.push("UNSUPPORTED_VERSION");
    }


    if (!deactivation.runtimeId) {
      reasons.push("MISSING_RUNTIME_ID");
    }


    if (!deactivation.createdAt) {
      reasons.push("MISSING_CREATED_AT");
    }


    return {
      success: reasons.length === 0,
      deactivation
    };
  }
}
