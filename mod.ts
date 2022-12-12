import { debug as debug_ } from "https://deno.land/x/debug@0.2.0/mod.ts";
import {
  debugEnvPermissionStatus,
  getDebugEnvPermissionStatus,
} from "./debugEnvPermissionStatus.ts";

export interface Debug {
  (fmt: string, ...args: unknown[]): void;
}

export interface Options {
  /**
   * If true, warn when a log message is delivered asynchronously.
   * @defaultValue `true`
   */
  warnOnAsyncLog?: boolean;
}

export function debug(namespace: string, options?: Options): Debug {
  if (debugEnvPermissionStatus) {
    return debugUsingDebugEnvPermissionStatus(
      namespace,
      debugEnvPermissionStatus,
    );
  } else {
    let logger: Debug;

    const loggerFromPermStatusPromise = getDebugEnvPermissionStatus()
      .then((status) => {
        logger = debugUsingDebugEnvPermissionStatus(namespace, status);
        return logger;
      });

    logger = (...args) => {
      loggerFromPermStatusPromise.then((logger) => {
        logger(...args);
        if (options?.warnOnAsyncLog !== false) {
          // We give this warning on the same logger as the log message so
          // it doesn't show up if the logger is disabled.
          logger(
            "quiet-debug warning: previous log message was delivered asynchronously",
          );
        }
      });
    };

    return (...args) => logger(...args);
  }
}

function debugUsingDebugEnvPermissionStatus(
  namespace: string,
  status: Deno.PermissionStatus,
): Debug {
  if (status.state === "granted") {
    return debug_(namespace);
  } else if (status.state === "denied") {
    return () => {};
  } else {
    // status.state is "prompt". Support the possibility of the
    // permission changing later.
    let logger: Debug;

    logger = (...args) => {
      if (status.state === "granted") {
        logger = debug_(namespace);
        logger(...args);
      } else if (status.state === "denied") {
        logger = () => {};
      }
    };

    return (...args) => logger(...args);
  }
}
