# My Plugin -- Ogma Plugin Template

Replace this file with a description of what your plugin does.

## Adapt this template

1. Edit `manifest.json` -- change `id`, `name`, `description`, and `permissions`.
2. Edit `dist/plugin.js` -- implement your plugin logic.
3. Rename the directory from `template` to your plugin id.
4. (Optional) Add a frontend: see [security-headers](../security-headers) for a full example.

The `dist/plugin.js` file is the backend entry point. For a plain JavaScript plugin there is no build step -- edit it directly. For TypeScript, see the [security-headers](../security-headers) plugin which shows the full TypeScript + esbuild workflow.

## Install

In Ogma, go to **Settings > Plugins > Install** and enter the path to this directory.

## Manifest fields

| Field | Required | Description |
|-------|----------|-------------|
| `id` | Yes | Unique, lowercase, hyphens allowed: `my-plugin` |
| `version` | Yes | Semver: `1.0.0` |
| `name` | Yes | Display name shown in Ogma |
| `description` | Yes | One sentence |
| `permissions` | Yes | Declare what the plugin accesses |
| `backend` | If backend | Path to the compiled backend entry point |
| `frontend` | If frontend | Path to the compiled frontend entry point, or object with `entrypoint` and `style` |

## Permissions

Declare all permissions your plugin uses:

| Permission | When to use |
|------------|-------------|
| `write_findings` | Plugin calls `sdk.findings.create()` |
| `read_http_history` | Plugin calls `sdk.requests.search()` or `sdk.requests.get()` |
| `send_requests` | Plugin calls `sdk.requests.send()` to make outbound HTTP requests |
| `ui_extension` | Plugin has a `frontend` entry point |
| `read_env_vars` | Plugin reads environment variables via `sdk.env` |

## Backend API reference

```javascript
async function init(sdk) {
  // Logging
  sdk.console.log("message");
  sdk.console.warn("message");
  sdk.console.error("message");

  // Intercept every HTTP request before it leaves
  sdk.events.onInterceptRequest(async function(req) {
    req.getHost();         // string: "example.com"
    req.getPort();         // number: 443
    req.getMethod();       // string: "GET"
    req.getPath();         // string: "/api/data"
    req.getQuery();        // string: "?foo=bar" or ""
    req.getId();           // string | null: history entry id
    // req.getBody()       // string | null: request body (if available)
  });

  // Intercept every HTTP response
  sdk.events.onInterceptResponse(function(req, resp) {
    if (!resp) return;     // resp is null for connection errors
    resp.getStatus();      // number: 200
    resp.getHeader("content-type");  // string | undefined: case-insensitive lookup
  });

  // Register a function callable from the frontend via sdk.backend.call()
  sdk.api.register("myFunction", function(arg1, arg2) {
    return { result: "value" };  // can also return a Promise
  });

  // Send an event to the frontend (received by sdk.backend.onEvent)
  sdk.api.send("myEvent", { data: "value" });

  // Search HTTP history
  var results = await sdk.requests.search({ q: "host:example.com", limit: 50 });

  // Create a finding
  await sdk.findings.create({
    title: "Finding title",
    severity: "medium",   // "info" | "low" | "medium" | "high" | "critical"
    description: "What was found and why it matters.",
    dedupe_key: "my-plugin:key",  // optional: prevents duplicate findings
    entry_id: req.getId() || undefined,  // optional: links to HTTP entry
  });

  // Plugin storage (persists across restarts, scoped to this plugin)
  await sdk.storage.set("key", "value");
  var val = await sdk.storage.get("key");  // string | null
  var keys = await sdk.storage.keys();
  await sdk.storage.delete("key");
  await sdk.storage.clear();
}
```

## Frontend (optional)

If your plugin has a UI panel, add `"frontend": "dist/frontend.js"` to `manifest.json`. The frontend runs in a sandboxed iframe (`allow-scripts` only -- no `localStorage`, no parent DOM access).

```javascript
// dist/frontend.js
(function() {
  window.ogmaSDK.ready(function(sdk) {
    // Build the UI using DOM APIs
    var panel = document.createElement("div");
    panel.textContent = "Hello from the plugin frontend!";
    document.body.appendChild(panel);

    // Register this as a navigable page in Ogma
    sdk.navigation.addPage("/my-plugin", { title: "My Plugin" });

    // Call backend functions
    sdk.backend.call("myFunction", "arg1", "arg2").then(function(result) {
      console.log(result);
    });

    // Receive events from the backend
    sdk.backend.onEvent(function(e) {
      if (e.event === "myEvent") {
        console.log(e.args[0]);  // the first argument passed to sdk.api.send
      }
    });
  });
})();
```

## License

MIT
