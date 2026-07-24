/**
 * CyberServices Deployment Proof Validator
 *
 * ONE JOB:
 * Validate deployment proof records for structural correctness.
 *
 * Owns:
 * - Checking required proof fields
 * - Checking proof version compatibility
 * - Returning validation results
 *
 * Does NOT:
 * - Create proofs
 * - Build manifests
 * - Validate manifests
 * - Deploy systems
 * - Mutate proof records
 */

import type {
  CyberServicesDeploymentProofRecord,
  CyberServicesDeploymentProofResult
} from "./CYBERSERVICES_DEPLOYMENT_PROOF_TYPES";


export class CyberServicesDeploymentProofValidator {

  validate(
    proof: CyberServicesDeploymentProofRecord
  ): CyberServicesDeploymentProofResult {

    const reasons: string[] = [];


    if (!proof.identity.proofId) {
      reasons.push("MISSING_PROOF_ID");
    }


    if (!proof.identity.version) {
      reasons.push("MISSING_VERSION");
    }


    if (proof.identity.version !== "DP-1") {
      reasons.push("UNSUPPORTED_VERSION");
    }


    if (!proof.deploymentId) {
      reasons.push("MISSING_DEPLOYMENT_ID");
    }


    if (!proof.contractId) {
      reasons.push("MISSING_CONTRACT_ID");
    }


    if (!proof.createdAt) {
      reasons.push("MISSING_CREATED_AT");
    }


    return {
      valid: reasons.length === 0,
      proof
    };
  }
}
