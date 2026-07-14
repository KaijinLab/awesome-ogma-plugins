// Request Counter -- frontend
//
// Runs in a sandboxed iframe (allow-scripts only, no allow-same-origin).
// No localStorage, no parent DOM access, no external scripts.
// Use sdk.backend.call to talk to the backend.

(function() {
  window.ogmaSDK.ready(function(sdk) {
    sdk.sidebar.registerItem("Request Counter", "/request-counter");

    var root = document.createElement("div");
    root.className = "rc-root";

    var heading = document.createElement("h2");
    heading.className = "rc-heading";
    heading.textContent = "Request Counter";
    root.appendChild(heading);

    var countRow = document.createElement("div");
    countRow.className = "rc-count-row";
    var countLabel = document.createElement("span");
    countLabel.textContent = "Requests seen: ";
    var countVal = document.createElement("span");
    countVal.className = "rc-count";
    countVal.textContent = "--";
    countRow.appendChild(countLabel);
    countRow.appendChild(countVal);
    root.appendChild(countRow);

    var recentHeading = document.createElement("h3");
    recentHeading.className = "rc-subheading";
    recentHeading.textContent = "Recent hosts";
    root.appendChild(recentHeading);

    var hostsList = document.createElement("ul");
    hostsList.className = "rc-hosts";
    root.appendChild(hostsList);

    var resetBtn = document.createElement("button");
    resetBtn.className = "rc-reset";
    resetBtn.textContent = "Reset";
    resetBtn.addEventListener("click", function() {
      sdk.backend.call("reset").then(function() {
        refresh();
      }).catch(function(err) {
        countVal.textContent = "Error";
      });
    });
    root.appendChild(resetBtn);

    sdk.navigation.addPage("/request-counter", { title: "Request Counter", body: root });

    function refresh() {
      sdk.backend.call("getStats").then(function(data) {
        if (!data) return;
        countVal.textContent = String(data.count || 0);
        hostsList.innerHTML = "";
        if (!data.recentHosts || data.recentHosts.length === 0) {
          var li = document.createElement("li");
          li.className = "rc-host rc-host--empty";
          li.textContent = "No hosts yet.";
          hostsList.appendChild(li);
        } else {
          (data.recentHosts || []).forEach(function(h) {
            var li = document.createElement("li");
            li.className = "rc-host";
            li.textContent = h;
            hostsList.appendChild(li);
          });
        }
      }).catch(function(err) {
        countVal.textContent = "Error";
        var li = document.createElement("li");
        li.className = "rc-host rc-host--error";
        li.textContent = "Failed to load: " + (err && err.message ? err.message : String(err));
        hostsList.innerHTML = "";
        hostsList.appendChild(li);
      });
    }

    sdk.backend.onEvent(function(e) {
      // sdk.api.send delivers args as an array; args[0] is the first argument.
      // backend calls: sdk.api.send("count_update", { count, host })
      // so e.args[0] is the object { count, host }.
      if (e.event === "count_update" && e.args && e.args[0]) {
        countVal.textContent = String(e.args[0].count || 0);
      }
    });

    refresh();
  });
})();
