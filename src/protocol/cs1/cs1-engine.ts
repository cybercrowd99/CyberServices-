/**
 * CYBERCROWD — CYBERSERVICES
 *
 * PATH:
 * src/protocol/cs1/cs1-engine.ts
 *
 * ONE JOB:
 * Produce deterministic CS-1 operation results and continuity seals
 * from caller-supplied operation data.
 *
 * OWNERSHIP:
 * - CS-1 request validation
 * - Deterministic payload fingerprinting
 * - Deterministic metadata binding
 * - Deterministic seal creation
 * - Continuity-chain extension
 *
 * THIS FILE MUST NEVER:
 * - Generate random UUIDs
 * - Generate timestamps internally
 * - Resolve lanes
 * - Register lanes
 * - Execute external services
 * - Create authority
 * - Authenticate identity
 * - Authorize payments
 * - Mutate MDC metadata
 * - Write Ledger history
 */

import type {
  CSOperationRequest,
  CSOperationResult,
  CSError,
  CSSeal,
  CSSealRef
} from "../../protocol-spec";


/**
 * Convert supported values into stable serialized form.
 *
 * Object keys are sorted so equivalent inputs always produce
 * equivalent fingerprints regardless of property insertion order.
 */
function stableSerialize(
  value: unknown
): string {

  if (value === null) {
    return "null";
  }

  if (value === undefined) {
    return "undefined";
  }

  if (
    typeof value === "string" ||
    typeof value === "boolean"
  ) {
    return JSON.stringify(value);
  }

  if (typeof value === "number") {

    if (Number.isNaN(value)) {
      return "\"NaN\"";
    }

    if (value === Infinity) {
      return "\"Infinity\"";
    }

    if (value === -Infinity) {
      return "\"-Infinity\"";
    }

    return String(value);
  }

  if (typeof value === "bigint") {
    return `"${value.toString()}n"`;
  }

  if (Array.isArray(value)) {

    return (
      "[" +
      value
        .map(item => stableSerialize(item))
        .join(",") +
      "]"
    );
  }

  if (typeof value === "object") {

    const objectValue =
      value as Record<string, unknown>;

    const keys =
      Object.keys(objectValue)
        .sort();

    return (
      "{" +
      keys
        .map(
          key =>
            `${JSON.stringify(key)}:${stableSerialize(
              objectValue[key]
            )}`
        )
        .join(",") +
      "}"
    );
  }

  return JSON.stringify(String(value));
}


/**
 * Small deterministic fingerprint function.
 *
 * This is used for CS-1 deterministic continuity identity.
 * It is not payment authorization and does not create authority.
 */
function deterministicFingerprint(
  value: unknown
): string {

  const input =
    stableSerialize(value);

  let hashA =
    0x811c9dc5;

  let hashB =
    0x9e3779b9;


  for (
    let index = 0;
    index < input.length;
    index++
  ) {

    const code =
      input.charCodeAt(index);

    hashA ^=
      code;

    hashA =
      Math.imul(
        hashA,
        0x01000193
      );


    hashB ^=
      code + index;

    hashB =
      Math.imul(
        hashB,
        0x85ebca6b
      );
  }


  const partA =
    (hashA >>> 0)
      .toString(16)
      .padStart(8, "0");

  const partB =
    (hashB >>> 0)
      .toString(16)
      .padStart(8, "0");


  return `${partA}${partB}`;
}


/**
 * CS-1 does not generate time.
 *
 * Time must enter the engine as declared operation metadata.
 */
function getDeclaredTimestamp(
  metadata: Record<string, any>
): string | null {

  if (
    typeof metadata.timestamp === "string" &&
    metadata.timestamp.length > 0
  ) {
    return metadata.timestamp;
  }


  if (
    typeof metadata.createdAt === "string" &&
    metadata.createdAt.length > 0
  ) {
    return metadata.createdAt;
  }


  return null;
}


class SealEngine {

  createSeal(
    input: {
      operationId: string;
      laneId: string;
      actorId: string;
      timestamp: string;
      payload: unknown;
      metadata: Record<string, any>;
      upstreamSeals?: CSSealRef[];
    }
  ): CSSeal {

    const metadataBinding =
      {
        ...input.metadata
      };


    const payloadFingerprint =
      deterministicFingerprint(
        input.payload
      );


    const sealMaterial = {
      operationId:
        input.operationId,

      laneId:
        input.laneId,

      actorId:
        input.actorId,

      timestamp:
        input.timestamp,

      metadataBinding,

      payloadFingerprint,

      upstreamSeals:
        input.upstreamSeals ?? []
    };


    const hash =
      deterministicFingerprint(
        sealMaterial
      );


    const sealId =
      `cs1-${hash}`;


    return {
      sealId,
      operationId:
        input.operationId,

      laneId:
        input.laneId,

      actorId:
        input.actorId,

      timestamp:
        input.timestamp,

      hash,

      metadataBinding,

      payloadFingerprint,

      upstreamSeals:
        input.upstreamSeals ?? []
    };
  }
}


export class CS1Engine {

  private readonly sealEngine =
    new SealEngine();


  execute(
    request: CSOperationRequest
  ): CSOperationResult | CSError {

    const validation =
      this.validateRequest(
        request
      );


    if (validation) {
      return validation;
    }


    const metadata =
      request.metadata ?? {};


    const timestamp =
      getDeclaredTimestamp(
        metadata
      ) as string;


    const seal =
      this.sealEngine.createSeal({
        operationId:
          request.operationId,

        laneId:
          request.laneId,

        actorId:
          request.actorId,

        timestamp,

        payload:
          request.payload,

        metadata,

        upstreamSeals:
          request.upstreamSeals
      });


    return {
      operationId:
        request.operationId,

      laneId:
        request.laneId,

      actorId:
        request.actorId,

      resultPayload:
        request.payload,

      resultMetadata: {
        protocol: "CS-1",
        processed: true
      },

      seal,

      continuityChain: [
        ...(request.upstreamSeals ?? []),

        {
          sealId:
            seal.sealId,

          hash:
            seal.hash
        }
      ]
    };
  }


  private validateRequest(
    request: CSOperationRequest
  ): CSError | null {

    if (!request.operationId) {

      return this.validationError(
        "unknown",
        "operationId",
        "Missing operationId"
      );
    }


    if (!request.laneId) {

      return this.validationError(
        "unknown",
        request.operationId,
        "Missing laneId"
      );
    }


    if (!request.actorId) {

      return this.validationError(
        request.laneId,
        request.operationId,
        "Missing actorId"
      );
    }


    const metadata =
      request.metadata ?? {};


    if (
      !getDeclaredTimestamp(
        metadata
      )
    ) {

      return this.validationError(
        request.laneId,
        request.operationId,
        "Missing deterministic timestamp in metadata.timestamp or metadata.createdAt"
      );
    }


    return null;
  }


  private validationError(
    laneId: string,
    operationIdentity: string,
    message: string
  ): CSError {

    const errorId =
      `cs1-error-${deterministicFingerprint({
        laneId,
        operationIdentity,
        type: "validation",
        message
      })}`;


    return {
      errorId,
      laneId,
      type: "validation",
      message
    };
  }
}
