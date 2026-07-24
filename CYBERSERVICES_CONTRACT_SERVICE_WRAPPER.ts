/**
 * CyberServices Contract Service Wrapper
 *
 * ONE JOB:
 * Wrap CyberServices operations in a stable contract-shaped service interface.
 *
 * Owns:
 * - Accepting contract envelopes from upstream routing
 * - Invoking an injected CyberServices operation
 * - Returning contract-shaped results
 *
 * Does NOT:
 * - Validate contracts
 * - Adapt contract shapes
 * - Route contracts
 * - Deploy systems
 * - Mutate original contract payloads
 */

import type {
  CyberServicesContractEnvelope,
  CyberServicesContractResult
} from "./CYBERSERVICES_CONTRACT_TYPES";


export interface CyberServicesOperationExecutor {
  execute<T>(
    contract: CyberServicesContractEnvelope<T>
  ): Promise<T>;
}


export class CyberServicesContractServiceWrapper {

  constructor(
    private readonly executor: CyberServicesOperationExecutor
  ) {}


  async handle<T>(
    contract: CyberServicesContractEnvelope<T>
  ): Promise<CyberServicesContractResult<T>> {

    const resultPayload =
      await this.executor.execute(contract);


    return {
      success: true,

      contract: {
        ...contract,
        payload: resultPayload
      }
    };
  }
}
