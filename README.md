# quiet-debug

This is a wrapper around the Deno [debug](https://github.com/denosaurs/debug)
library that avoids prompting the user for the DEBUG environment variable access
permission.

The DEBUG environment variable is only accessed if the user has already given
permission to it through the `--allow-env=DEBUG`, `--allow-env`, or
`--allow-all` Deno flags. The user is expected to pass one of these flags if
they want to see debug messages. This prevents an unnecessary permission prompt
in the simple case where a Deno script is run from a terminal without any added
permissions and without the DEBUG environment variable being set.

This library supports the same features as
[debug](https://github.com/denosaurs/debug). See its documentation for more
details.

```ts
import { debug } from "https://deno.land/x/quiet_debug/mod.ts";

const log = debug("app");
const name = "My Awesome App";

const app = new Application();

app.use((ctx) => {
  log("%s %s", ctx.request.method, ctx.request.url.pathname);
  ctx.response.body = "Hello World!";
});

log("Starting %s...", name);
await app.listen({ port: 8000 });
```

```
$ DEBUG=worker deno run --allow-env script.ts
```
