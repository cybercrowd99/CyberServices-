/**
 * CyberServices Deployment Manifest Validator
 *
 * ONE JOB:
 * Validate deployment manifests for structural correctness.
 *
 * Owns:
 * - Checking required manifest fields
 * - Checking manifest version compatibility
 * - Returning validation results
 *
 * Does NOT:
 * - Build manifests
 * - Validate proofs
 * - Deploy systems
 * - Execute operations
 * - Mutate manifest records
 */

import type {
  CyberServicesDeploymentManifest
} from "./CYBERSERVICES_DEPLOYMENT_MANIFEST_BUILDER";


export interface CyberServicesDeploymentManifestValidationResult {
  valid: boolean;
  reasons: string[];
  manifest: CyberServicesDeploymentManifest;
}


export class CyberServicesDeploymentManifestValidator {

  validate(
    manifest: CyberServicesDeploymentManifest
  ): CyberServicesDeploymentManifestValidationResult {

    const reasons: string[] = [];


    if (!manifest.identity.manifestId) {
      reasons.push("MISSING_MANIFEST_ID");
    }


    if (!manifest.identity.version) {
      reasons.push("MISSING_VERSION");
    }


    if (manifest.identity.version !== "DM-1") {
      reasons.push("UNSUPPORTED_VERSION");
    }


    if (!manifest.createdAt) {
      reasons.push("MISSING_CREATED_AT");
    }


    if (!Array.isArray(manifest.proofs)) {
      reasons.push("MISSING_PROOFS");
    }


    if (
      Array.isArray(manifest.proofs) &&
      manifest.proofs.length === 0
    ) {
      reasons.push("EMPTY_PROOF_SET");
    }


    return {
      valid: reasons.length === 0,
      reasons,
      manifest
    };
  }
}
