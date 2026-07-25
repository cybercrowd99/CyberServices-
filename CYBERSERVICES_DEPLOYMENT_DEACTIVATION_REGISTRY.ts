/**
 * CyberServices Deployment Deactivation Registry
 *
 * ONE JOB:
 * Store and retrieve validated deployment deactivation records.
 *
 * Owns:
 * - Registering deactivation records
 * - Retrieving deactivation records by identity
 * - Providing deactivation lookup access
 *
 * Does NOT:
 * - Create deactivations
 * - Validate deactivations
 * - Deactivate runtimes
 * - Bind runtimes
 * - Deploy systems
 * - Execute operations
 * - Change deployment authority
 */

import type {
  CyberServicesDeploymentDeactivationRecord
} from "./CYBERSERVICES_DEPLOYMENT_DEACTIVATION_TYPES";


export interface CyberServicesDeploymentDeactivationStore {

  put(
    key: string,
    value: string
  ): Promise<void>;


  get(
    key: string
  ): Promise<string | null>;
}


export class CyberServicesDeploymentDeactivationRegistry {

  constructor(
    private readonly store:
      CyberServicesDeploymentDeactivationStore
  ) {}


  async register(
    deactivation: CyberServicesDeploymentDeactivationRecord
  ): Promise<CyberServicesDeploymentDeactivationRecord> {

    await this.store.put(
      `deactivation:${deactivation.identity.deactivationId}`,
      JSON.stringify(deactivation)
    );

    return deactivation;
  }


  async get(
    deactivationId: string
  ): Promise<CyberServicesDeploymentDeactivationRecord | null> {

    const raw =
      await this.store.get(
        `deactivation:${deactivationId}`
      );


    if (!raw) {
      return null;
    }


    try {

      return JSON.parse(
        raw
      ) as CyberServicesDeploymentDeactivationRecord;

    } catch {

      return null;
    }
  }
}
