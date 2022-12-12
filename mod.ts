import { debug as debug_ } from "https://deno.land/x/debug@0.2.0/mod.ts";

export interface Debug {
  (fmt: string, ...args: unknown[]): void;
}

const debugEnvPermissionStatus = await Deno.permissions.query({
  name: "env",
  variable: "DEBUG",
});

export function debug(namespace: string): Debug {
  if (debugEnvPermissionStatus.state === "granted") {
    return debug_(namespace);
  } else {
    return () => {};
  }
}
