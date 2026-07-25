/**
 * CyberServices Deployment Runtime Registry
 *
 * ONE JOB:
 * Store and retrieve validated deployment runtime records.
 *
 * Owns:
 * - Registering runtime records
 * - Retrieving runtime records by identity
 * - Providing runtime lookup access
 *
 * Does NOT:
 * - Create runtimes
 * - Validate runtimes
 * - Bind runtimes
 * - Deploy systems
 * - Execute operations
 * - Change deployment authority
 */

import type {
  CyberServicesDeploymentRuntimeRecord
} from "./CYBERSERVICES_DEPLOYMENT_RUNTIME_TYPES";


export interface CyberServicesDeploymentRuntimeStore {
  put(
    key: string,
    value: string
  ): Promise<void>;

  get(
    key: string
  ): Promise<string | null>;
}


export class CyberServicesDeploymentRuntimeRegistry {

  constructor(
    private readonly store:
      CyberServicesDeploymentRuntimeStore
  ) {}


  async register(
    runtime: CyberServicesDeploymentRuntimeRecord
  ): Promise<CyberServicesDeploymentRuntimeRecord> {

    await this.store.put(
      `runtime:${runtime.identity.runtimeId}`,
      JSON.stringify(runtime)
    );

    return runtime;
  }


  async get(
    runtimeId: string
  ): Promise<CyberServicesDeploymentRuntimeRecord | null> {

    const raw =
      await this.store.get(
        `runtime:${runtimeId}`
      );


    if (!raw) {
      return null;
    }


    try {

      return JSON.parse(
        raw
      ) as CyberServicesDeploymentRuntimeRecord;

    } catch {

      return null;
    }
  }
}
