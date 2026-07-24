/**
 * CyberServices KV Corruption Tests
 *
 * ONE JOB:
 * Verify deterministic behavior of the KV corruption chain.
 *
 * Owns:
 * - Testing Guard → Ledger → Response → Handler → Pipeline → Service flows
 * - Confirming contract stability
 *
 * Does NOT:
 * - Modify runtime logic
 * - Detect corruption
 * - Handle production KV
 * - Repair records
 * - Change authority
 */
