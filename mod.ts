import { debug as debug_ } from "https://deno.land/x/debug@0.2.0/mod.ts";
import { debugEnvPermissionStatus } from "./debugEnvPermissionStatus.ts";

export interface Debug {
  (fmt: string, ...args: unknown[]): void;
}

export function debug(namespace: string): Debug {
  if (debugEnvPermissionStatus.state === "granted") {
    return debug_(namespace);
  } else if (debugEnvPermissionStatus.state === "denied") {
    return () => {};
  } else {
    // debugEnvPermissionStatus.state is "prompt". Support the
    // possibility of the permission changing later.
    let logger: Debug;

    logger = (...args) => {
      if (debugEnvPermissionStatus.state === "granted") {
        logger = debug_(namespace);
        logger(...args);
      } else if (debugEnvPermissionStatus.state === "denied") {
        logger = () => {};
      }
    };

    return (...args) => logger(...args);
  }
}
