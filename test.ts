import { debug } from "./mod.ts";

Deno.test("debug", () => {
  const log = debug("test");
  log("should happen without ENV permission prompt");
});
