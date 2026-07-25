/**
 * CyberServices Deployment Activation Service
 *
 * ONE JOB:
 * Provide a stable service boundary for deployment activation handling.
 *
 * Owns:
 * - Accepting activation requests
 * - Delegating activation operations
 * - Returning deterministic service results
 *
 * Does NOT:
 * - Create activations
 * - Validate activations
 * - Activate runtimes
 * - Bind runtimes
 * - Register activations
 * - Deploy systems
 * - Execute operations
 * - Change deployment authority
 */

import type {
  CyberServicesDeploymentActivationRecord,
  CyberServicesDeploymentActivationResult
} from "./CYBERSERVICES_DEPLOYMENT_ACTIVATION_TYPES";


export interface CyberServicesDeploymentActivationValidatorPort {

  validate(
    activation: CyberServicesDeploymentActivationRecord
  ): CyberServicesDeploymentActivationResult;
}


export interface CyberServicesDeploymentActivationRegistryPort {

  register(
    activation: CyberServicesDeploymentActivationRecord
  ): Promise<CyberServicesDeploymentActivationRecord>;


  get(
    activationId: string
  ): Promise<CyberServicesDeploymentActivationRecord | null>;
}


export interface CyberServicesDeploymentActivationServiceResult {
  success: boolean;
  validation: CyberServicesDeploymentActivationResult;
  stored?: CyberServicesDeploymentActivationRecord | null;
}


export class CyberServicesDeploymentActivationService {

  constructor(
    private readonly validator:
      CyberServicesDeploymentActivationValidatorPort,

    private readonly registry:
      CyberServicesDeploymentActivationRegistryPort
  ) {}


  async handle(
    activation: CyberServicesDeploymentActivationRecord
  ): Promise<CyberServicesDeploymentActivationServiceResult> {

    const validation =
      this.validator.validate(activation);


    if (!validation.success) {

      return {
        success: false,
        validation
      };
    }


    const stored =
      await this.registry.register(activation);


    return {
      success: true,
      validation,
      stored
    };
  }
}
