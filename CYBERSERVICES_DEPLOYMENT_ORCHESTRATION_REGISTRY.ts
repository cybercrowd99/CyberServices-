/**
 * CyberServices Deployment Orchestration Registry
 *
 * ONE JOB:
 * Store and retrieve validated deployment orchestration records.
 *
 * Owns:
 * - Registering orchestration records
 * - Retrieving orchestration records by identity
 * - Providing orchestration lookup access
 *
 * Does NOT:
 * - Create orchestrations
 * - Validate orchestrations
 * - Execute workflows
 * - Trigger runtime actions
 * - Activate runtimes
 * - Deactivate runtimes
 * - Deploy systems
 * - Change deployment authority
 */

import type {
  CyberServicesDeploymentOrchestrationRecord
} from "./CYBERSERVICES_DEPLOYMENT_ORCHESTRATION_TYPES";


export interface CyberServicesDeploymentOrchestrationStore {

  put(
    key: string,
    value: string
  ): Promise<void>;


  get(
    key: string
  ): Promise<string | null>;
}


export class CyberServicesDeploymentOrchestrationRegistry {

  constructor(
    private readonly store:
      CyberServicesDeploymentOrchestrationStore
  ) {}


  async register(
    orchestration: CyberServicesDeploymentOrchestrationRecord
  ): Promise<CyberServicesDeploymentOrchestrationRecord> {

    await this.store.put(
      `orchestration:${orchestration.identity.orchestrationId}`,
      JSON.stringify(orchestration)
    );

    return orchestration;
  }


  async get(
    orchestrationId: string
  ): Promise<CyberServicesDeploymentOrchestrationRecord | null> {

    const raw =
      await this.store.get(
        `orchestration:${orchestrationId}`
      );


    if (!raw) {
      return null;
    }


    try {

      return JSON.parse(
        raw
      ) as CyberServicesDeploymentOrchestrationRecord;

    } catch {

      return null;
    }
  }
}
