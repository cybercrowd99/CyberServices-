/**
 * CyberServices Deployment Proof Builder
 *
 * ONE JOB:
 * Create deployment proof records from supplied deployment facts.
 *
 * Owns:
 * - Generating proof identities
 * - Building proof records
 * - Assigning creation timestamps
 *
 * Does NOT:
 * - Validate proofs
 * - Build manifests
 * - Validate manifests
 * - Deploy systems
 * - Change deployment authority
 */

import type {
  CyberServicesDeploymentProofRecord
} from "./CYBERSERVICES_DEPLOYMENT_PROOF_TYPES";


export interface CyberServicesDeploymentProofInput {
  deploymentId: string;
  contractId: string;
}


export class CyberServicesDeploymentProofBuilder {

  build(
    input: CyberServicesDeploymentProofInput
  ): CyberServicesDeploymentProofRecord {

    return {
      identity: {
        proofId: crypto.randomUUID(),
        version: "DP-1"
      },

      status: "CREATED",

      deploymentId: input.deploymentId,

      contractId: input.contractId,

      createdAt: new Date().toISOString()
    };
  }
}
