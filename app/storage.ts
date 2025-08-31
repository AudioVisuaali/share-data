import { logger } from "./logger";

type Data = Record<string, unknown>;

export class Storage {
  private store = new Map<string, Data>();

  public set = (key: string, value: Data) => {
    logger.log("Setting", key, value);
    this.store[key] = value;
  };

  public get = (key: string): Record<string, unknown> | null => {
    logger.log("Getting", key);
    return this.store[key] || null;
  };
}
