import once from "https://deno.land/x/once@0.3.0/index.ts";

export let debugEnvPermissionStatus: Deno.PermissionStatus | undefined =
  undefined;

export const getDebugEnvPermissionStatus = once(() =>
  Deno.permissions.query({
    name: "env",
    variable: "DEBUG",
  })
    .then((status) => {
      debugEnvPermissionStatus = status;
      return status;
    })
);
