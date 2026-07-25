/**
 * CyberServices Deployment Runtime Service
 *
 * ONE JOB:
 * Provide a stable service boundary for deployment runtime handling.
 *
 * Owns:
 * - Accepting runtime requests
 * - Delegating runtime operations
 * - Returning deterministic service results
 *
 * Does NOT:
 * - Create runtimes
 * - Validate runtimes
 * - Bind runtimes
 * - Register runtimes
 * - Deploy systems
 * - Execute operations
 * - Mutate runtime data
 */

import type {
  CyberServicesDeploymentRuntimeRecord,
  CyberServicesDeploymentRuntimeResult
} from "./CYBERSERVICES_DEPLOYMENT_RUNTIME_TYPES";


export interface CyberServicesDeploymentRuntimeValidatorPort {
  validate(
    runtime: CyberServicesDeploymentRuntimeRecord
  ): CyberServicesDeploymentRuntimeResult;
}


export interface CyberServicesDeploymentRuntimeRegistryPort {

  register(
    runtime: CyberServicesDeploymentRuntimeRecord
  ): Promise<CyberServicesDeploymentRuntimeRecord>;


  get(
    runtimeId: string
  ): Promise<CyberServicesDeploymentRuntimeRecord | null>;
}


export interface CyberServicesDeploymentRuntimeServiceResult {
  success: boolean;
  validation: CyberServicesDeploymentRuntimeResult;
  stored?: CyberServicesDeploymentRuntimeRecord | null;
}


export class CyberServicesDeploymentRuntimeService {

  constructor(
    private readonly validator:
      CyberServicesDeploymentRuntimeValidatorPort,

    private readonly registry:
      CyberServicesDeploymentRuntimeRegistryPort
  ) {}


  async handle(
    runtime: CyberServicesDeploymentRuntimeRecord
  ): Promise<CyberServicesDeploymentRuntimeServiceResult> {

    const validation =
      this.validator.validate(runtime);


    if (!validation.success) {

      return {
        success: false,
        validation
      };
    }


    const stored =
      await this.registry.register(runtime);


    return {
      success: true,
      validation,
      stored
    };
  }
}
