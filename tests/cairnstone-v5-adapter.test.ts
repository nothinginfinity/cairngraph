import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { buildCairnGraphFromV5, mergeV5StonePayloadsIntoManifest } from "../packages/adapters/src/index.js";
import type { CairnStoneChainManifest } from "../packages/graph-engine/src/types.js";
import type { CairnStoneV5StonePayload } from "../packages/adapters/src/cairnstone-v5.js";

const manifest = JSON.parse(
  readFileSync("examples/loop-engineer-template-review.manifest.json", "utf8")
) as CairnStoneChainManifest;

const headPayload: CairnStoneV5StonePayload = {
  ok: true,
  stone: {
    border: {
      hash: "c6580ddea6224aa08c602ac38051a97e79e84fab412927bdc5dc8618d22491eb",
      title: "CairnStone vNext LoopPlane + HarnessPlane + VerificationPlane notes",
      author: "chatgpt",
      created: "2026-06-23T02:28:44.724Z",
      repo: "AI-Builder-Club/loop-engineer-template",
      commit: "main",
      path: "content.txt",
      chain: "loop-engineer-template-review"
    },
    layers: {
      lod5: "CairnStone vNext LoopPlane + HarnessPlane + VerificationPlane notes: 337 lines, 5 refs, 3.25x ratio, 1 flags",
      lod2: {
        compressed_index: [
          {
            ref_id: "fsl:c8e8a0caf67193dc",
            stone_hash: "c6580ddea6224aa08c602ac38051a97e79e84fab412927bdc5dc8618d22491eb",
            path: "content.txt",
            line_start: 241,
            line_end: 320,
            keywords: ["ztgi", "agent", "byteplane", "cairnstone"],
            preview: "Verification checks and source proof windows",
            raw_key: "raw/5fa48030bbf9cba9693e962fc241751cd8513e28621b4db97064ddd5b031d821.txt"
          }
        ]
      }
    },
    metadata: {},
    related: []
  }
};

test("merges CairnStone V5 stone payload refs into manifest nodes", () => {
  const merged = mergeV5StonePayloadsIntoManifest(manifest, [headPayload]);
  const head = merged.nodes?.find((node) => node.hash === manifest.head_hash);

  assert.ok(head);
  assert.equal(head.refs?.length, 1);
  assert.equal(head.refs?.[0]?.ref_id, "fsl:c8e8a0caf67193dc");
  assert.equal((head.metadata?.github as { owner?: string } | undefined)?.owner, "AI-Builder-Club");
});

test("builds CairnGraph directly from V5 manifest plus stone payloads", () => {
  const graph = buildCairnGraphFromV5({ manifest, stones: [headPayload] });
  const refs = graph.nodes.filter((node) => node.kind === "ref");

  assert.equal(refs.length, 1);
  assert.equal(refs[0]?.evidence.ref_id, "fsl:c8e8a0caf67193dc");
  assert.equal(refs[0]?.evidence.line_start, 241);
  assert.equal(refs[0]?.evidence.line_end, 320);
  assert.match(refs[0]?.evidence.source_url ?? "", /#L241-L320$/);
});
