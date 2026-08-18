/**
 * CYBERCROWD — CYBERSERVICES
 *
 * PATH:
 * CYBERSERVICES_CONTRACT_DEPLOYMENT_LAYER.ts
 *
 * ONE JOB:
 * Bind the CyberServices contract adapter, validator, router,
 * and service wrapper into one deterministic deployment path.
 *
 * OWNERSHIP:
 * - Contract component composition
 * - Contract validation handoff
 * - Declared route confirmation
 * - Explicit CS-1 operation handoff
 * - Contract-shaped execution result return
 *
 * THIS FILE MUST NEVER:
 * - Validate contracts itself
 * - Adapt contract shapes itself
 * - Invent routes
 * - Invent operation data
 * - Invent lane IDs
 * - Invent actor IDs
 * - Execute lane internals
 * - Modify payloads
 * - Create authority
 */

import type {
  CyberServicesContractResult
} from "./CYBERSERVICES_CONTRACT_TYPES";

import type {
  CSOperationRequest,
  CSServiceExecutionResult
} from "./src/protocol-spec";

import {
  CyberServicesContractAdapter
} from "./CYBERSERVICES_CONTRACT_ADAPTER";

import {
  CyberServicesContractValidator
} from "./CYBERSERVICES_CONTRACT_VALIDATOR";

import {
  CyberServicesContractRouter
} from "./CYBERSERVICES_CONTRACT_ROUTER";

import {
  CyberServicesContractServiceWrapper
} from "./CYBERSERVICES_CONTRACT_SERVICE_WRAPPER";

import CyberServicesOperationExecutor
  from "./CYBERSERVICES_OPERATION_EXECUTOR";


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
    executor:
      CyberServicesOperationExecutor =
        new CyberServicesOperationExecutor()
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
      operation: CSOperationRequest;
    }
  ): Promise<
    CyberServicesContractResult<
      CSServiceExecutionResult
    >
  > {

    const envelope =
      this.adapter.adapt({
        contractId:
          input.contractId,

        version:
          input.version,

        payload:
          input.payload
      });


    const validation =
      this.validator.validate(
        envelope
      );


    if (
      validation.status === "INVALID"
    ) {

      return {
        success: false,

        contract: {
          ...envelope,

          payload: {
            operationId:
              input.operation.operationId,

            laneId:
              input.operation.laneId,

            resultPayload:
              input.payload,

            resultMetadata: {
              execution:
                "NOT_EXECUTED",

              reason:
                "INVALID_CONTRACT"
            }
          }
        }
      };
    }


    const routeResult =
      this.router.route(
        envelope,
        input.routes
      );


    if (
      !routeResult.routed
    ) {

      return {
        success: false,

        contract: {
          ...envelope,

          payload: {
            operationId:
              input.operation.operationId,

            laneId:
              input.operation.laneId,

            resultPayload:
              input.payload,

            resultMetadata: {
              execution:
                "NOT_EXECUTED",

              reason:
                "ROUTE_NOT_FOUND"
            }
          }
        }
      };
    }


    return this.wrapper.handle(
      envelope,
      input.operation
    );
  }
}
