/**
 * CyberServices Deployment Manifest Service
 *
 * ONE JOB:
 * Provide a stable service boundary for deployment manifest handling.
 *
 * Owns:
 * - Accepting deployment manifest requests
 * - Delegating manifest operations
 * - Returning deterministic service results
 *
 * Does NOT:
 * - Build manifests
 * - Validate manifests
 * - Validate proofs
 * - Deploy systems
 * - Execute operations
 * - Mutate manifest data
 */

import type {
  CyberServicesDeploymentManifest
} from "./CYBERSERVICES_DEPLOYMENT_MANIFEST_BUILDER";

import type {
  CyberServicesDeploymentManifestValidationResult
} from "./CYBERSERVICES_DEPLOYMENT_MANIFEST_VALIDATOR";


export interface CyberServicesDeploymentManifestServiceResult {
  success: boolean;
  validation: CyberServicesDeploymentManifestValidationResult;
}


export interface CyberServicesDeploymentManifestValidatorPort {
  validate(
    manifest: CyberServicesDeploymentManifest
  ): CyberServicesDeploymentManifestValidationResult;
}


export class CyberServicesDeploymentManifestService {

  constructor(
    private readonly validator:
      CyberServicesDeploymentManifestValidatorPort
  ) {}


  handle(
    manifest: CyberServicesDeploymentManifest
  ): CyberServicesDeploymentManifestServiceResult {

    const validation =
      this.validator.validate(
        manifest
      );

    return {
      success: validation.valid,
      validation
    };
  }
}
