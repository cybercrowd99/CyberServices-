/**
 * CYBERCROWD — CYBERSERVICES
 *
 * PATH:
 * src/index.ts
 *
 * ONE JOB:
 * Expose the live CyberServices Worker boundary and connect
 * declared CS-1 operation requests to the CyberServices runtime.
 *
 * OWNERSHIP:
 * - CyberServices Worker startup
 * - CyberServices lane bootstrap
 * - Health response
 * - Controlled CS-1 execution endpoint
 * - Delegation to CyberServicesOperationExecutor
 *
 * THIS FILE MUST NEVER:
 * - Define lanes
 * - Execute lane internals
 * - Invent routes
 * - Create authority
 * - Authenticate identity
 * - Authorize payments
 * - Mutate MDC metadata
 * - Write Ledger history
 * - Call external providers
 * - Absorb CORE, NET, MDC, CCF, or Ledger responsibilities
 */

import type {
  CSOperationRequest,
} from "./protocol-spec";

import {
  bootstrapCyberServicesLanes,
  getBootstrappedCyberServicesLanes,
} from "./lanes/lane-bootstrap";

import CyberServicesOperationExecutor
  from "../CYBERSERVICES_OPERATION_EXECUTOR";


/**
 * Bootstrap the declared CyberServices lanes once
 * when the Worker module is initialized.
 */
bootstrapCyberServicesLanes();


/**
 * Shared stateless CyberServices operation executor.
 */
const operationExecutor =
  new CyberServicesOperationExecutor();


export default {
  async fetch(
    request: Request,
    env: unknown,
    ctx: ExecutionContext
  ): Promise<Response> {

    const url =
      new URL(request.url);


    /**
     * Health / runtime visibility.
     */
    if (
      request.method === "GET" &&
      (
        url.pathname === "/" ||
        url.pathname === "/health"
      )
    ) {

      return Response.json({
        system: "CyberServices",
        status: "ONLINE",
        protocol: "CS-1",

        lanes:
          getBootstrappedCyberServicesLanes()
            .map(
              lane => ({
                laneId: lane.laneId,
                laneType: lane.laneType,
              })
            ),
      });
    }


    /**
     * CS-1 execution boundary.
     */
    if (
      request.method === "POST" &&
      url.pathname === "/execute"
    ) {

      let operation:
        CSOperationRequest;


      try {

        operation =
          await request.json()
            as CSOperationRequest;

      } catch {

        return Response.json(
          {
            success: false,
            error:
              "INVALID_JSON",
          },
          {
            status: 400,
          }
        );
      }


      try {

        const result =
          await operationExecutor.execute(
            operation
          );


        return Response.json({
          success: true,
          protocol: "CS-1",
          result,
        });

      } catch (error) {

        return Response.json(
          {
            success: false,

            error:
              error instanceof Error
                ? error.message
                : "CYBERSERVICES_EXECUTION_FAILED",
          },
          {
            status: 400,
          }
        );
      }
    }


    /**
     * CyberServices owns no undeclared routes.
     */
    return Response.json(
      {
        system: "CyberServices",
        status: "NOT_FOUND",
      },
      {
        status: 404,
      }
    );
  }
};
