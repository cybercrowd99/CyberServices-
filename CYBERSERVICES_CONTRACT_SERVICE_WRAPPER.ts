/**
 * CYBERCROWD — CYBERSERVICES
 *
 * PATH:
 * CYBERSERVICES_CONTRACT_SERVICE_WRAPPER.ts
 *
 * ONE JOB:
 * Wrap an already-declared CS-1 operation request in the
 * CyberServices contract service boundary.
 *
 * OWNERSHIP:
 * - Accepting validated contract envelopes
 * - Accepting already-declared CS-1 operation requests
 * - Delegating execution to CyberServicesOperationExecutor
 * - Returning contract-shaped execution results
 *
 * THIS FILE MUST NEVER:
 * - Adapt contract shapes
 * - Validate contracts
 * - Route contracts
 * - Invent lane IDs
 * - Invent actor IDs
 * - Build operation requests from incomplete data
 * - Execute lane internals
 * - Mutate the original contract
 */

import type {
  CyberServicesContractEnvelope,
  CyberServicesContractResult
} from "./CYBERSERVICES_CONTRACT_TYPES";

import type {
  CSOperationRequest,
  CSServiceExecutionResult
} from "./src/protocol-spec";

import CyberServicesOperationExecutor
  from "./CYBERSERVICES_OPERATION_EXECUTOR";


export class CyberServicesContractServiceWrapper {

  constructor(
    private readonly executor:
      CyberServicesOperationExecutor =
        new CyberServicesOperationExecutor()
  ) {}


  async handle<T>(
    contract: CyberServicesContractEnvelope<T>,
    request: CSOperationRequest
  ): Promise<
    CyberServicesContractResult<
      CSServiceExecutionResult
    >
  > {

    const result =
      await this.executor.execute(
        request
      );


    return {
      success: true,

      contract: {
        identity: {
          ...contract.identity
        },

        status:
          contract.status,

        createdAt:
          contract.createdAt,

        payload:
          result
      }
    };
  }
}
