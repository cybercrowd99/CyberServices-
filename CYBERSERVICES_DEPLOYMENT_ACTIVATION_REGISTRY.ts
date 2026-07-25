/**
 * CyberServices Deployment Activation Registry
 *
 * ONE JOB:
 * Store and retrieve validated deployment activation records.
 *
 * Owns:
 * - Registering activation records
 * - Retrieving activation records by identity
 * - Providing activation lookup access
 *
 * Does NOT:
 * - Create activations
 * - Validate activations
 * - Activate runtimes
 * - Bind runtimes
 * - Deploy systems
 * - Execute operations
 * - Change deployment authority
 */

import type {
  CyberServicesDeploymentActivationRecord
} from "./CYBERSERVICES_DEPLOYMENT_ACTIVATION_TYPES";


export interface CyberServicesDeploymentActivationStore {

  put(
    key: string,
    value: string
  ): Promise<void>;


  get(
    key: string
  ): Promise<string | null>;
}


export class CyberServicesDeploymentActivationRegistry {

  constructor(
    private readonly store:
      CyberServicesDeploymentActivationStore
  ) {}


  async register(
    activation: CyberServicesDeploymentActivationRecord
  ): Promise<CyberServicesDeploymentActivationRecord> {

    await this.store.put(
      `activation:${activation.identity.activationId}`,
      JSON.stringify(activation)
    );

    return activation;
  }


  async get(
    activationId: string
  ): Promise<CyberServicesDeploymentActivationRecord | null> {

    const raw =
      await this.store.get(
        `activation:${activationId}`
      );


    if (!raw) {
      return null;
    }


    try {

      return JSON.parse(
        raw
      ) as CyberServicesDeploymentActivationRecord;

    } catch {

      return null;
    }
  }
}
