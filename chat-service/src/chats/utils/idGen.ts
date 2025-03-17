/**
 * Snowflake ID Generator
 * 
 * Structure:
 * - 41 bits: Timestamp (milliseconds since custom epoch)
 * - 10 bits: Machine/Node ID (0-1023)
 * - 12 bits: Sequence number (0-4095)
 */

// Custom epoch (January 1, 2023)
const EPOCH = 1672531200000;

// Bit lengths
const TIMESTAMP_BITS = BigInt(41);
const NODE_ID_BITS = BigInt(10);
const SEQUENCE_BITS = BigInt(12);

// Maximum values
const MAX_NODE_ID = (BigInt(1) << NODE_ID_BITS) - BigInt(1);
const MAX_SEQUENCE = (BigInt(1) << SEQUENCE_BITS) - BigInt(1);

// Bit shifts
const NODE_ID_SHIFT = SEQUENCE_BITS;
const TIMESTAMP_SHIFT = NODE_ID_BITS + SEQUENCE_BITS;

export class SnowflakeIdGenerator {
  private nodeId: bigint;
  private sequence: bigint = BigInt(0);
  private lastTimestamp: bigint = BigInt(-1);

  /**
   * Create a new Snowflake ID generator
   * @param nodeId - Unique identifier for this node/instance (0-1023)
   */
  constructor(nodeId: number = 1) {
    if (nodeId < 0 || nodeId > Number(MAX_NODE_ID)) {
      throw new Error(`Node ID must be between 0 and ${MAX_NODE_ID}`);
    }
    this.nodeId = BigInt(nodeId);
  }

  /**
   * Generate a new unique ID
   * @returns A unique 64-bit ID as a string
   */
  public nextId(): string {
    let timestamp = this.currentTimestamp();

    // Handle clock moving backwards
    if (timestamp < this.lastTimestamp) {
      throw new Error(
        `Clock moved backwards. Refusing to generate ID for ${this.lastTimestamp - timestamp
        } milliseconds.`
      );
    }

    // Handle same millisecond
    if (timestamp === this.lastTimestamp) {
      this.sequence = (this.sequence + BigInt(1)) & MAX_SEQUENCE;
      // Sequence overflow, wait for next millisecond
      if (this.sequence === BigInt(0)) {
        timestamp = this.waitNextMillis(this.lastTimestamp);
      }
    } else {
      // Reset sequence for new millisecond
      this.sequence = BigInt(0);
    }

    this.lastTimestamp = timestamp;

    // Construct the ID
    const id =
      ((timestamp - BigInt(EPOCH)) << TIMESTAMP_SHIFT) |
      (this.nodeId << NODE_ID_SHIFT) |
      this.sequence;

    return id.toString();
  }

  /**
   * Get current timestamp in milliseconds
   */
  private currentTimestamp(): bigint {
    return BigInt(Date.now());
  }

  /**
   * Wait until next millisecond
   */
  private waitNextMillis(lastTimestamp: bigint): bigint {
    let timestamp = this.currentTimestamp();
    while (timestamp <= lastTimestamp) {
      timestamp = this.currentTimestamp();
    }
    return timestamp;
  }
}

// Default singleton instance
const defaultGenerator = new SnowflakeIdGenerator(
  process.env.NODE_ID ? parseInt(process.env.NODE_ID, 10) : undefined
);

/**
 * Generate a new unique ID using the default generator
 */
export function generateId(): string {
  return defaultGenerator.nextId();
}
