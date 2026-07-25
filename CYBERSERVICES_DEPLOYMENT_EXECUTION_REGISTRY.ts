/**
 * CyberServices Deployment Execution Registry
 *
 * ONE JOB:
 * Store and retrieve validated deployment execution records.
 *
 * Owns:
 * - Registering execution records
 * - Retrieving execution records by identity
 * - Providing execution lookup access
 *
 * Does NOT:
 * - Create executions
 * - Validate executions
 * - Execute operations
 * - Trigger runtimes
 * - Coordinate workflows
 * - Activate runtimes
 * - Deactivate runtimes
 * - Deploy systems
 * - Change deployment authority
 */

import type {
  CyberServicesDeploymentExecutionRecord
} from "./CYBERSERVICES_DEPLOYMENT_EXECUTION_TYPES";


export interface CyberServicesDeploymentExecutionStore {

  put(
    key: string,
    value: string
  ): Promise<void>;


  get(
    key: string
  ): Promise<string | null>;
}


export class CyberServicesDeploymentExecutionRegistry {

  constructor(
    private readonly store:
      CyberServicesDeploymentExecutionStore
  ) {}


  async register(
    execution: CyberServicesDeploymentExecutionRecord
  ): Promise<CyberServicesDeploymentExecutionRecord> {

    await this.store.put(
      `execution:${execution.identity.executionId}`,
      JSON.stringify(execution)
    );

    return execution;
  }


  async get(
    executionId: string
  ): Promise<CyberServicesDeploymentExecutionRecord | null> {

    const raw =
      await this.store.get(
        `execution:${executionId}`
      );


    if (!raw) {
      return null;
    }


    try {

      return JSON.parse(
        raw
      ) as CyberServicesDeploymentExecutionRecord;

    } catch {

      return null;
    }
  }
}
