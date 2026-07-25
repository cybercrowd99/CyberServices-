/**
 * CyberServices Deployment Activation Validator
 *
 * ONE JOB:
 * Validate deployment activation records for structural correctness.
 *
 * Owns:
 * - Checking required activation fields
 * - Checking activation version compatibility
 * - Returning validation results
 *
 * Does NOT:
 * - Create activations
 * - Activate runtimes
 * - Bind runtimes
 * - Register activations
 * - Deploy systems
 * - Execute operations
 * - Mutate activation records
 */

import type {
  CyberServicesDeploymentActivationRecord,
  CyberServicesDeploymentActivationResult
} from "./CYBERSERVICES_DEPLOYMENT_ACTIVATION_TYPES";


export class CyberServicesDeploymentActivationValidator {

  validate(
    activation: CyberServicesDeploymentActivationRecord
  ): CyberServicesDeploymentActivationResult {

    const reasons: string[] = [];


    if (!activation.identity.activationId) {
      reasons.push("MISSING_ACTIVATION_ID");
    }


    if (!activation.identity.version) {
      reasons.push("MISSING_VERSION");
    }


    if (activation.identity.version !== "DA-1") {
      reasons.push("UNSUPPORTED_VERSION");
    }


    if (!activation.runtimeId) {
      reasons.push("MISSING_RUNTIME_ID");
    }


    if (!activation.createdAt) {
      reasons.push("MISSING_CREATED_AT");
    }


    return {
      success: reasons.length === 0,
      activation
    };
  }
}
