// Mirrors estimateDevSavings() from the release notes code sample.
(function () {
  var form = document.getElementById("estimator");
  if (!form) return;

  var money = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
  var LATENCY = "10,000x - 50,000x (Replaced network I/O with L1 Cache)";
  var FIELDS = ["dailyQueries", "monthlyVectorDbCost", "avgTokensPerQuery", "costPer1kTokens"];

  function estimateDevSavings(audit) {
    var dailyTokenCost =
      (audit.dailyQueries * audit.avgTokensPerQuery * audit.costPer1kTokens) / 1000;
    var monthlyLlmSpend = dailyTokenCost * 30 + audit.monthlyVectorDbCost;
    return {
      monthlyLlmSpend: Math.round(monthlyLlmSpend),
      annualSavingsWithDev: Math.round(monthlyLlmSpend * 12),
      latencyReductionFactor: LATENCY,
    };
  }

  function render() {
    var audit = {};
    var valid = FIELDS.every(function (name) {
      var value = form.elements[name].valueAsNumber;
      audit[name] = value;
      return Number.isFinite(value) && value >= 0;
    });

    var result = valid ? estimateDevSavings(audit) : null;
    document.getElementById("out-monthly").textContent = result
      ? money.format(result.monthlyLlmSpend)
      : "—";
    document.getElementById("out-annual").textContent = result
      ? money.format(result.annualSavingsWithDev) + "/year"
      : "—";
    document.getElementById("out-latency").textContent = result
      ? result.latencyReductionFactor
      : "—";
  }

  form.addEventListener("input", render);
  form.addEventListener("submit", function (event) {
    event.preventDefault();
  });
})();
