/**
 * CyberServices Deployment Deactivation Service
 *
 * ONE JOB:
 * Provide a stable service boundary for deployment deactivation handling.
 *
 * Owns:
 * - Accepting deactivation requests
 * - Delegating deactivation operations
 * - Returning deterministic service results
 *
 * Does NOT:
 * - Create deactivations
 * - Validate deactivations
 * - Deactivate runtimes
 * - Bind runtimes
 * - Register deactivations
 * - Deploy systems
 * - Execute operations
 * - Change deployment authority
 */

import type {
  CyberServicesDeploymentDeactivationRecord,
  CyberServicesDeploymentDeactivationResult
} from "./CYBERSERVICES_DEPLOYMENT_DEACTIVATION_TYPES";


export interface CyberServicesDeploymentDeactivationValidatorPort {

  validate(
    deactivation: CyberServicesDeploymentDeactivationRecord
  ): CyberServicesDeploymentDeactivationResult;
}


export interface CyberServicesDeploymentDeactivationRegistryPort {

  register(
    deactivation: CyberServicesDeploymentDeactivationRecord
  ): Promise<CyberServicesDeploymentDeactivationRecord>;


  get(
    deactivationId: string
  ): Promise<CyberServicesDeploymentDeactivationRecord | null>;
}


export interface CyberServicesDeploymentDeactivationServiceResult {
  success: boolean;
  validation: CyberServicesDeploymentDeactivationResult;
  stored?: CyberServicesDeploymentDeactivationRecord | null;
}


export class CyberServicesDeploymentDeactivationService {

  constructor(
    private readonly validator:
      CyberServicesDeploymentDeactivationValidatorPort,

    private readonly registry:
      CyberServicesDeploymentDeactivationRegistryPort
  ) {}


  async handle(
    deactivation: CyberServicesDeploymentDeactivationRecord
  ): Promise<CyberServicesDeploymentDeactivationServiceResult> {

    const validation =
      this.validator.validate(deactivation);


    if (!validation.success) {

      return {
        success: false,
        validation
      };
    }


    const stored =
      await this.registry.register(deactivation);


    return {
      success: true,
      validation,
      stored
    };
  }
}
