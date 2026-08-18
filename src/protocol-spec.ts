/**
 * CYBERCROWD — CYBERSERVICES
 *
 * PATH:
 * src/protocol-spec.ts
 *
 * ONE JOB:
 * Define the shared CS-1 protocol structures used by CyberServices
 * lanes, operation execution, orchestration, and continuity.
 *
 * OWNERSHIP:
 * - CyberServices lane structure
 * - Operation request structure
 * - Service execution result structure
 * - CS-1 result structure
 * - CyberSeal reference structure
 * - CyberSeal structure
 * - Deterministic protocol error structure
 *
 * THIS FILE MUST NEVER:
 * - Execute operations
 * - Resolve lanes
 * - Register lanes
 * - Route contracts
 * - Create CyberSeals
 * - Validate authority
 * - Authenticate identity
 * - Authorize payments
 * - Mutate MDC metadata
 * - Write Ledger history
 * - Call external providers
 * - Absorb CORE, NET, MDC, CCF, or Ledger responsibilities
 */


/**
 * Registered CyberServices lane.
 */
export interface CSLane {
  laneId: string;
  laneType: string;

  metadata?: Record<string, unknown>;
}


/**
 * Reference to an existing CyberSeal.
 */
export interface CSSealRef {
  sealId: string;
  hash: string;
}


/**
 * CyberServices continuity seal.
 */
export interface CSSeal {
  sealId: string;

  operationId: string;
  laneId: string;
  actorId: string;

  timestamp: string;

  hash: string;

  metadataBinding: Record<string, unknown>;

  payloadFingerprint: string;

  upstreamSeals: CSSealRef[];
}


/**
 * Input presented to the CyberServices
 * operation execution system.
 */
export interface CSOperationRequest {
  operationId: string;

  laneId: string;

  actorId: string;

  payload: unknown;

  metadata?: Record<string, unknown>;

  upstreamSeals?: CSSealRef[];
}


/**
 * Result returned by the bounded
 * CyberServices service-execution layer.
 */
export interface CSServiceExecutionResult {
  operationId: string;

  laneId: string;

  resultPayload: unknown;

  resultMetadata: Record<string, unknown>;
}


/**
 * Complete CS-1 protocol result.
 */
export interface CSOperationResult {
  operationId: string;

  laneId: string;

  actorId: string;

  resultPayload: unknown;

  resultMetadata: Record<string, unknown>;

  seal: CSSeal;

  continuityChain: CSSealRef[];
}


/**
 * Deterministic CyberServices protocol error.
 */
export interface CSError {
  errorId: string;

  laneId: string;

  type: string;

  message: string;
}
