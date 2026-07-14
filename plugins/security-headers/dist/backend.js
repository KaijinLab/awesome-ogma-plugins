"use strict";
(() => {
  // src/backend.ts
  var CHECKS = [
    {
      header: "content-security-policy",
      title: "Missing Content-Security-Policy header",
      description: "No Content-Security-Policy header was found. CSP reduces the risk of XSS attacks by restricting what resources the browser can load.",
      severity: "high",
      weak: (v) => v === void 0
    },
    {
      header: "strict-transport-security",
      title: "Missing or weak Strict-Transport-Security header",
      description: "No HSTS header found, or max-age is set to 0 (disabled). Without HSTS, browsers may connect over HTTP, enabling downgrade attacks.",
      severity: "medium",
      weak: (v) => v === void 0 || /max-age\s*=\s*0\b/i.test(v)
    },
    {
      header: "x-frame-options",
      title: "Missing X-Frame-Options header",
      description: "No X-Frame-Options header was found. The page may be embeddable in an iframe, enabling clickjacking.",
      severity: "medium",
      weak: (v) => v === void 0
    },
    {
      header: "x-content-type-options",
      title: "Missing or weak X-Content-Type-Options header",
      description: "No X-Content-Type-Options: nosniff header. Browsers may MIME-sniff responses, enabling content injection.",
      severity: "low",
      weak: (v) => v === void 0 || !v.toLowerCase().includes("nosniff")
    },
    {
      header: "referrer-policy",
      title: "Missing Referrer-Policy header",
      description: "No Referrer-Policy header. The browser may send the full URL as a Referer to third-party sites.",
      severity: "low",
      weak: (v) => v === void 0
    },
    {
      header: "permissions-policy",
      title: "Missing Permissions-Policy header",
      description: "No Permissions-Policy header. Browser features (camera, microphone, geolocation) are not explicitly restricted.",
      severity: "info",
      weak: (v) => v === void 0
    }
  ];
  async function init(sdk) {
    sdk.console.log("security-headers: started");
    sdk.events.onInterceptResponse(function(req, resp) {
      if (!resp) return;
      const ct = resp.getHeader("content-type") ?? "";
      if (!ct.includes("text/html")) return;
      const host = req.getHost();
      const entryId = req.getId() ?? void 0;
      for (const check of CHECKS) {
        const headerValue = resp.getHeader(check.header);
        if (!check.weak(headerValue)) continue;
        try {
          sdk.findings.create({
            title: `${check.title} (${host})`,
            severity: check.severity,
            description: check.description,
            dedupe_key: `security-headers:${check.header}:${host}`,
            entry_id: entryId
          });
        } catch (e) {
          const msg = e instanceof Error ? e.message : String(e);
          sdk.console.warn(`security-headers: could not create finding: ${msg}`);
        }
      }
    });
  }
  globalThis.init = init;
})();
