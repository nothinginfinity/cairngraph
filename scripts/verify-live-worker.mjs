#!/usr/bin/env node

/**
 * verify-live-worker.mjs
 * 
 * Assert that the live CairnGraph Worker includes all v1.1 UX markers.
 * Runs after Deploy Worker to verify the full UX stack is live.
 * 
 * Markers checked:
 * - Graph explorer baseline (graph-canvas, zoom controls, reset-view)
 * - Graph explorer filtering (edge-filter, neighborhood-filter, node-search)
 * - Blast radius features (blast-summary, blast-toggle, dim-toggle)
 * - Evidence inspector (evidence-inspector, inspector-node-id, copy buttons)
 * 
 * Exit codes:
 * - 0: all markers found
 * - 1: missing markers
 * - 2: fetch or network error
 */

import https from "node:https";

const WORKER_URL = "https://cairngraph-worker.jaredtechfit.workers.dev/render/html";

const REQUIRED_MARKERS = [
  // Graph explorer baseline
  { name: "graph-canvas", desc: "SVG graph explorer viewport" },
  { name: "zoom-in", desc: "Zoom in button" },
  { name: "zoom-out", desc: "Zoom out button" },
  { name: "reset-view", desc: "Reset view button" },
  
  // Graph filtering
  { name: "node-search", desc: "Node search input" },
  { name: "edge-filter", desc: "Edge type filter select" },
  { name: "neighborhood-filter", desc: "Neighborhood toggle" },
  
  // Blast radius (v1.1-alpha.3)
  { name: "blast-summary", desc: "Blast radius summary panel" },
  { name: "blast-toggle", desc: "Blast overlay toggle" },
  { name: "dim-toggle", desc: "Dim unaffected nodes toggle" },
  
  // Evidence inspector (v1.1-alpha.4)
  { name: "evidence-inspector", desc: "Structured evidence inspector" },
  { name: "inspector-node-id", desc: "Node ID field in inspector" },
  { name: "copy-node-id", desc: "Copy node ID button" },
  { name: "copy-evidence-json", desc: "Copy evidence JSON button" },
  { name: "inspector-details", desc: "Collapsible evidence JSON details" },
];

async function fetchLiveHtml() {
  return new Promise((resolve, reject) => {
    const req = https.get(WORKER_URL, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        if (res.statusCode === 200) {
          resolve(data);
        } else {
          reject(new Error(`HTTP ${res.statusCode}`));
        }
      });
    });
    req.on("error", reject);
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error("Request timeout"));
    });
  });
}

async function main() {
  console.log("🔍 Verifying live CairnGraph Worker UX markers...\n");
  
  let html;
  try {
    html = await fetchLiveHtml();
  } catch (err) {
    console.error(`❌ Failed to fetch live worker: ${err.message}`);
    process.exit(2);
  }
  
  const missing = [];
  for (const marker of REQUIRED_MARKERS) {
    if (html.includes(marker.name)) {
      console.log(`✅ ${marker.name.padEnd(25)} — ${marker.desc}`);
    } else {
      console.log(`❌ ${marker.name.padEnd(25)} — ${marker.desc}`);
      missing.push(marker.name);
    }
  }
  
  console.log();
  if (missing.length === 0) {
    console.log(`✅ All ${REQUIRED_MARKERS.length} markers present on live worker`);
    process.exit(0);
  } else {
    console.log(`❌ Missing ${missing.length} markers: ${missing.join(", ")}`);
    process.exit(1);
  }
}

main();
