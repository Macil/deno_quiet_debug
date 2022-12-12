import { debug as debug_ } from "https://deno.land/x/debug@0.2.0/mod.ts";
import { debugEnvPermissionStatus } from "./debugEnvPermissionStatus.ts";

export interface Debug {
  (fmt: string, ...args: unknown[]): void;
}

function getFinalLogger(namespace: string): Debug | undefined {
  if (debugEnvPermissionStatus.state === "granted") {
    return debug_(namespace);
  } else if (debugEnvPermissionStatus.state === "denied") {
    return () => {};
  }
}

export function debug(namespace: string): Debug {
  const finalLogger = getFinalLogger(namespace);
  if (finalLogger) {
    return finalLogger;
  } else {
    // debugEnvPermissionStatus.state is "prompt". Support the
    // possibility of the permission changing later.
    let logger: Debug;

    logger = (...args) => {
      const finalLogger = getFinalLogger(namespace);
      if (finalLogger) {
        logger = finalLogger;
        finalLogger(...args);
      }
    };

    return (...args) => logger(...args);
  }
}
