document.getElementById("advisorForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const form = new FormData(e.target);
  let score = 0;

  for (const value of form.values()) {
    score += Number(value);
  }

  // Normalize score (max approx 175)
  let normalized = Math.max(0, Math.min(100, Math.round((score / 175) * 100)));

  // Platform Fit Logic
  let cloudRunFit = 0;
  let gkeFit = 0;
  let vmFit = 0;

  if (normalized >= 75) {
    cloudRunFit = normalized;
    gkeFit = 100 - normalized;
    vmFit = 10;
  } else if (normalized >= 45) {
    gkeFit = normalized;
    cloudRunFit = normalized - 20;
    vmFit = 100 - normalized;
  } else {
    vmFit = 100 - normalized;
    gkeFit = normalized;
    cloudRunFit = 10;
  }

  // Clamp values
  cloudRunFit = Math.max(0, Math.min(100, cloudRunFit));
  gkeFit = Math.max(0, Math.min(100, gkeFit));
  vmFit = Math.max(0, Math.min(100, vmFit));

  // Determine recommendation
  let title = "";
  let platform = "";
  let reasoning = "";
  let path = [];

  if (cloudRunFit >= gkeFit && cloudRunFit >= vmFit) {
    title = "High Modernization Readiness";
    platform = "Cloud Run";
    reasoning =
      "This application is well-suited for serverless container deployment. It is likely stateless, HTTP-based, and capable of scaling dynamically with minimal infrastructure management.";
    path = [
      "Containerize the application.",
      "Externalize session and file storage.",
      "Use Cloud Storage and Cloud SQL.",
      "Deploy to Cloud Run with autoscaling."
    ];
  } else if (gkeFit >= cloudRunFit && gkeFit >= vmFit) {
    title = "Moderate Modernization Readiness";
    platform = "GKE Autopilot";
    reasoning =
      "This application has multiple components or operational requirements that need more control. Kubernetes-based deployment is more suitable.";
    path = [
      "Break application into components.",
      "Containerize each service.",
      "Deploy to GKE Autopilot.",
      "Integrate with managed services."
    ];
  } else {
    title = "Low Modernization Readiness";
    platform = "Phased Approach (VM → Container)";
    reasoning =
      "The application still has strong dependencies on infrastructure, OS, or local storage. A phased modernization approach is recommended.";
    path = [
      "Rehost to Compute Engine.",
      "Identify dependencies and refactor.",
      "Externalize storage and config.",
      "Gradually containerize components."
    ];
  }

  // Update UI
  document.getElementById("resultTitle").textContent = title;
  document.getElementById("scoreValue").textContent = normalized + "%";
  document.getElementById("platform").textContent = platform;
  document.getElementById("reasoning").textContent = reasoning;

  // Path list
  const pathList = document.getElementById("path");
  pathList.innerHTML = "";
  path.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    pathList.appendChild(li);
  });

  // Update bars
  document.getElementById("cloudRunBar").style.width = cloudRunFit + "%";
  document.getElementById("gkeBar").style.width = gkeFit + "%";
  document.getElementById("vmBar").style.width = vmFit + "%";

  document.getElementById("cloudRunPercent").textContent = cloudRunFit + "%";
  document.getElementById("gkePercent").textContent = gkeFit + "%";
  document.getElementById("vmPercent").textContent = vmFit + "%";

  // Show result
  document.getElementById("result").classList.remove("hidden");
  document.getElementById("result").scrollIntoView({ behavior: "smooth" });
});
