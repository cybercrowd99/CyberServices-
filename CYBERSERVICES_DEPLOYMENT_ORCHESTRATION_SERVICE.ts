/**
 * CyberServices Deployment Orchestration Service
 *
 * ONE JOB:
 * Provide a stable service boundary for deployment orchestration handling.
 *
 * Owns:
 * - Accepting orchestration requests
 * - Delegating orchestration operations
 * - Returning deterministic service results
 *
 * Does NOT:
 * - Create orchestrations
 * - Validate orchestrations
 * - Execute workflows
 * - Trigger runtime actions
 * - Activate runtimes
 * - Deactivate runtimes
 * - Register orchestrations
 * - Deploy systems
 * - Change deployment authority
 */

import type {
  CyberServicesDeploymentOrchestrationRecord,
  CyberServicesDeploymentOrchestrationResult
} from "./CYBERSERVICES_DEPLOYMENT_ORCHESTRATION_TYPES";


export interface CyberServicesDeploymentOrchestrationValidatorPort {

  validate(
    orchestration: CyberServicesDeploymentOrchestrationRecord
  ): CyberServicesDeploymentOrchestrationResult;
}


export interface CyberServicesDeploymentOrchestrationRegistryPort {

  register(
    orchestration: CyberServicesDeploymentOrchestrationRecord
  ): Promise<CyberServicesDeploymentOrchestrationRecord>;


  get(
    orchestrationId: string
  ): Promise<CyberServicesDeploymentOrchestrationRecord | null>;
}


export interface CyberServicesDeploymentOrchestrationServiceResult {
  success: boolean;
  validation: CyberServicesDeploymentOrchestrationResult;
  stored?: CyberServicesDeploymentOrchestrationRecord | null;
}


export class CyberServicesDeploymentOrchestrationService {

  constructor(
    private readonly validator:
      CyberServicesDeploymentOrchestrationValidatorPort,

    private readonly registry:
      CyberServicesDeploymentOrchestrationRegistryPort
  ) {}


  async handle(
    orchestration: CyberServicesDeploymentOrchestrationRecord
  ): Promise<CyberServicesDeploymentOrchestrationServiceResult> {

    const validation =
      this.validator.validate(orchestration);


    if (!validation.success) {

      return {
        success: false,
        validation
      };
    }


    const stored =
      await this.registry.register(orchestration);


    return {
      success: true,
      validation,
      stored
    };
  }
}
