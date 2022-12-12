export const debugEnvPermissionStatus = await Deno.permissions.query({
  name: "env",
  variable: "DEBUG",
});
