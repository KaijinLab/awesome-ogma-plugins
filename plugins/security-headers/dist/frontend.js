"use strict";
(() => {
  // src/frontend.ts
  (function() {
    window.ogmaSDK.ready(function(sdk) {
      try {
        sdk.sidebar.registerItem("Security Headers", "/security-headers");
        const root = document.createElement("div");
        root.style.cssText = "padding:16px;font-family:system-ui,sans-serif;color:#e2e4ed;background:#0f1117;min-height:100%";
        const heading = document.createElement("h2");
        heading.textContent = "Security Headers";
        heading.style.cssText = "font-size:16px;font-weight:600;margin:0 0 8px 0";
        root.appendChild(heading);
        const info = document.createElement("p");
        info.textContent = "Passively checks HTML responses for missing security headers. Findings appear in the Findings view after each intercepted HTML page.";
        info.style.cssText = "font-size:12px;color:#6b7280;margin:0 0 16px 0;line-height:1.5";
        root.appendChild(info);
        const checks = [
          { name: "Content-Security-Policy", severity: "High" },
          { name: "Strict-Transport-Security", severity: "Medium" },
          { name: "X-Frame-Options", severity: "Medium" },
          { name: "X-Content-Type-Options", severity: "Low" },
          { name: "Referrer-Policy", severity: "Low" },
          { name: "Permissions-Policy", severity: "Info" }
        ];
        const table = document.createElement("table");
        table.style.cssText = "width:100%;border-collapse:collapse;font-size:12px";
        const thead = document.createElement("thead");
        const headerRow = document.createElement("tr");
        for (const col of ["Header", "Severity"]) {
          const th = document.createElement("th");
          th.textContent = col;
          th.setAttribute("scope", "col");
          th.style.cssText = "text-align:left;padding:4px 8px;color:#9ca3af;font-weight:500;border-bottom:1px solid #1f2230";
          headerRow.appendChild(th);
        }
        thead.appendChild(headerRow);
        table.appendChild(thead);
        const tbody = document.createElement("tbody");
        for (const c of checks) {
          const tr = document.createElement("tr");
          const tdName = document.createElement("td");
          tdName.textContent = c.name;
          tdName.style.cssText = "font-family:monospace;padding:4px 8px;border-bottom:1px solid #1f2230;color:#c9d1d9";
          const tdSev = document.createElement("td");
          tdSev.textContent = c.severity;
          tdSev.style.cssText = "padding:4px 8px;border-bottom:1px solid #1f2230;color:" + severityColor(c.severity);
          tr.appendChild(tdName);
          tr.appendChild(tdSev);
          tbody.appendChild(tr);
        }
        table.appendChild(tbody);
        root.appendChild(table);
        document.body.style.cssText = "margin:0;padding:0;background:#0f1117";
        document.body.appendChild(root);
        sdk.navigation.addPage("/security-headers", { title: "Security Headers" });
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        const errEl = document.createElement("div");
        errEl.style.cssText = "padding:16px;color:#f87171;font-size:12px;font-family:system-ui";
        errEl.textContent = "Security Headers plugin failed to load: " + msg;
        document.body.appendChild(errEl);
        console.error("[security-headers]", err);
      }
    });
    function severityColor(s) {
      switch (s) {
        case "High":
          return "#f87171";
        case "Medium":
          return "#fb923c";
        case "Low":
          return "#facc15";
        default:
          return "#60a5fa";
      }
    }
  })();
})();
