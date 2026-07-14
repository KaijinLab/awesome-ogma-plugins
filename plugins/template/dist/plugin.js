// Ogma Plugin -- backend entry point
//
// This file is the compiled backend. For a plain JavaScript plugin (no build step),
// edit this file directly. For TypeScript, edit src/backend.ts and run npm run build.
//
// Constraints:
//   - No import or require. All code must be in this single file.
//   - No fetch or XMLHttpRequest. Use sdk.requests.send() to make HTTP requests.
//   - All sdk.* data methods return Promises. Use await.
//   - The Ogma runtime calls init(sdk) once when the plugin is enabled.

async function init(sdk) {
  sdk.console.log("my-plugin started");

  // -- Storage example --
  // var count = parseInt((await sdk.storage.get("count")) || "0", 10);
  // await sdk.storage.set("count", String(count + 1));

  // -- Intercept requests --
  sdk.events.onInterceptRequest(async function(req) {
    var host = req.getHost();
    var method = req.getMethod();
    var path = req.getPath();
    sdk.console.log("Request: " + method + " " + host + path);
  });

  // -- Intercept responses --
  // sdk.events.onInterceptResponse(function(req, resp) {
  //   if (!resp) return;
  //   var status = resp.getStatus();
  //   var ct = resp.getHeader("content-type") || "";
  //   sdk.console.log("Response: " + status + " " + req.getHost());
  // });

  // -- Register a function callable from the frontend --
  sdk.api.register("ping", function() {
    return { ok: true, message: "pong" };
  });

  // -- Create a finding --
  // sdk.findings.create({
  //   title: "Example Finding (" + host + ")",
  //   severity: "low",          // "info" | "low" | "medium" | "high" | "critical"
  //   description: "Explanation of what was found and why it matters.",
  //   dedupe_key: "my-plugin:example:" + host,  // prevents duplicate findings per host
  //   entry_id: req.getId() || undefined,        // links finding to the HTTP entry
  // });
}
