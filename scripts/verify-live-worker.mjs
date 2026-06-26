#!/usr/bin/env node

/**
 * verify-live-worker.mjs
 * 
 * Assert that the live CairnGraph Worker includes all v1.1 UX markers.
 * Runs after Deploy Worker to verify the full UX stack is live.
 * 
 * Note: This script verifies that the Worker renders HTML with v1.1 markers.
 * For full integration testing, use: node scripts/verify-live-chain.mjs
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

// TODO: Use a valid graph from CairnStone V5 provider when configured
// For now, this demonstrates the marker verification approach
async function fetchLiveHtml() {
  return new Promise((resolve, reject) => {
    // For v1.1-beta verification, we test that the code compiles and the Worker is deployed
    // Full live verification requires CairnStone V5 provider binding in Worker environment
    
    const samplePayload = JSON.stringify({
      graph: {
        source: { chain: "test", head_hash: "abc" },
        nodes: [{ id: "n1", label: "Test", kind: "file", grounding: "grounded", evidence: {} }],
        edges: []
      }
    });

    const options = {
      hostname: "cairngraph-worker.jaredtechfit.workers.dev",
      path: "/render/html",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(samplePayload)
      },
      timeout: 10000
    };
    
    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        // Accept both HTML and JSON error responses for diagnostic purposes
        if (res.statusCode === 200 || res.statusCode === 400) {
          resolve(data);
        } else {
          reject(new Error(`HTTP ${res.statusCode}`));
        }
      });
    });
    
    req.on("error", reject);
    req.on("timeout", () => {
      req.destroy();
      reject(new Error("Request timeout"));
    });
    
    req.write(samplePayload);
    req.end();
  });
}

async function main() {
  console.log("🔍 Verifying CairnGraph Worker v1.1 UX markers are compiled...\n");
  
  let html;
  try {
    html = await fetchLiveHtml();
  } catch (err) {
    console.error(`⚠️  Worker fetch error (this is expected if CairnStone provider not configured): ${err.message}`);
    console.error("   Full live verification requires: Env { CAIRNSTONE_V5_API_KEY }\n");
    process.exit(1);
  }
  
  console.log("✅ Worker is responding\n");
  const missing = [];
  
  for (const marker of REQUIRED_MARKERS) {
    if (html.includes(marker.name)) {
      console.log(`✅ ${marker.name.padEnd(25)} — ${marker.desc}`);
    } else {
      console.log(`⚠️  ${marker.name.padEnd(25)} — ${marker.desc} (not in response)`);
      missing.push(marker.name);
    }
  }
  
  console.log();
  if (missing.length === 0) {
    console.log(`✅ All ${REQUIRED_MARKERS.length} markers detected in Worker output`);
    console.log("\nNote: Full verification requires live CairnStone V5 integration.");
    process.exit(0);
  } else {
    console.log(`⚠️  ${missing.length} markers not detected: ${missing.join(", ")}`);
    process.exit(1);
  }
}

main();
