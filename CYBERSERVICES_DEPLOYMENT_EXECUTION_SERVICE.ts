/**
 * CyberServices Deployment Execution Service
 *
 * ONE JOB:
 * Provide a stable service boundary for deployment execution handling.
 *
 * Owns:
 * - Accepting execution requests
 * - Delegating execution operations
 * - Returning deterministic service results
 *
 * Does NOT:
 * - Create executions
 * - Validate executions internally
 * - Execute operations
 * - Trigger runtimes
 * - Coordinate workflows
 * - Activate runtimes
 * - Deactivate runtimes
 * - Register executions
 * - Deploy systems
 * - Change deployment authority
 */

import type {
  CyberServicesDeploymentExecutionRecord,
  CyberServicesDeploymentExecutionResult
} from "./CYBERSERVICES_DEPLOYMENT_EXECUTION_TYPES";


export interface CyberServicesDeploymentExecutionValidatorPort {

  validate(
    execution: CyberServicesDeploymentExecutionRecord
  ): CyberServicesDeploymentExecutionResult;
}


export interface CyberServicesDeploymentExecutionRegistryPort {

  register(
    execution: CyberServicesDeploymentExecutionRecord
  ): Promise<CyberServicesDeploymentExecutionRecord>;


  get(
    executionId: string
  ): Promise<CyberServicesDeploymentExecutionRecord | null>;
}


export interface CyberServicesDeploymentExecutionServiceResult {
  success: boolean;
  validation: CyberServicesDeploymentExecutionResult;
  stored?: CyberServicesDeploymentExecutionRecord | null;
}


export class CyberServicesDeploymentExecutionService {

  constructor(
    private readonly validator:
      CyberServicesDeploymentExecutionValidatorPort,

    private readonly registry:
      CyberServicesDeploymentExecutionRegistryPort
  ) {}


  async handle(
    execution: CyberServicesDeploymentExecutionRecord
  ): Promise<CyberServicesDeploymentExecutionServiceResult> {

    const validation =
      this.validator.validate(execution);


    if (!validation.success) {

      return {
        success: false,
        validation
      };
    }


    const stored =
      await this.registry.register(execution);


    return {
      success: true,
      validation,
      stored
    };
  }
}
