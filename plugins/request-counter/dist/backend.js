// Request Counter -- backend
//
// No import or require. Classes (RequestSpec, Body, OgmaError) are globals.
// All sdk.* data methods return Promises -- use await.

var count = 0;
var recentHosts = [];

async function init(sdk) {
  sdk.console.log("request-counter started");

  sdk.events.onInterceptRequest(async function(req) {
    count += 1;
    var host = req.getHost();
    if (recentHosts.length >= 5) recentHosts.shift();
    recentHosts.push(host);
    sdk.api.send("count_update", { count: count, host: host });
  });

  sdk.api.register("getStats", function() {
    return { count: count, recentHosts: recentHosts };
  });

  sdk.api.register("reset", function() {
    count = 0;
    recentHosts = [];
    return { ok: true };
  });
}
