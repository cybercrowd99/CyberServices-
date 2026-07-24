/**
 * CyberServices Contract Deployment Layer
 *
 * ONE JOB:
 * Bind the contract adapter, validator, router, and service wrapper
 * into a single deployable runtime unit.
 *
 * Owns:
 * - Wiring contract components together
 * - Providing a stable runtime entry point
 * - Returning deterministic contract-shaped results
 *
 * Does NOT:
 * - Validate contracts
 * - Adapt contract shapes
 * - Route contracts
 * - Execute service logic
 * - Modify payloads
 */

import type {
  CyberServicesContractEnvelope,
  CyberServicesContractResult
} from "./CYBERSERVICES_CONTRACT_TYPES";

import {
  CyberServicesContractAdapter
} from "./CYBERSERVICES_CONTRACT_ADAPTER";

import {
  CyberServicesContractValidator
} from "./CYBERSERVICES_CONTRACT_VALIDATOR";

import {
  CyberServicesContractRouter
} from "./CYBERSERVICES_CONTRACT_ROUTER";

import type {
  CyberServicesOperationExecutor
} from "./CYBERSERVICES_CONTRACT_SERVICE_WRAPPER";

import {
  CyberServicesContractServiceWrapper
} from "./CYBERSERVICES_CONTRACT_SERVICE_WRAPPER";


export class CyberServicesContractDeploymentLayer {

  private readonly adapter =
    new CyberServicesContractAdapter();


  private readonly validator =
    new CyberServicesContractValidator();


  private readonly router =
    new CyberServicesContractRouter();


  private readonly wrapper:
    CyberServicesContractServiceWrapper;


  constructor(
    executor: CyberServicesOperationExecutor
  ) {

    this.wrapper =
      new CyberServicesContractServiceWrapper(
        executor
      );
  }


  async deploy<T>(
    input: {
      contractId: string;
      version: string;
      payload: T;
      routes: Record<string, string>;
    }
  ): Promise<CyberServicesContractResult<T>> {


    const envelope =
      this.adapter.adapt(input);


    const validation =
      this.validator.validate(
        envelope
      );


    if (validation.status === "INVALID") {

      return {
        success: false,
        contract: envelope
      };
    }


    const routeResult =
      this.router.route(
        envelope,
        input.routes
      );


    if (!routeResult.routed) {

      return {
        success: false,
        contract: envelope
      };
    }


    return await this.wrapper.handle(
      envelope
    );
  }
}
