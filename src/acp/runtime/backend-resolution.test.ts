import { describe, expect, it } from "vitest";
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import {
  resolveAcpBackendForAgent,
  resolveAgentConfiguredAcpBackend,
} from "./backend-resolution.js";

describe("ACP backend resolution", () => {
  it("uses the configured agent ACP backend before the global backend", () => {
    const cfg = {
      acp: { backend: "acpx" },
      agents: {
        list: [
          {
            id: "Quantum",
            runtime: {
              type: "acp",
              acp: { backend: "openclaw-quantum-acp" },
            },
          },
        ],
      },
    } as OpenClawConfig;

    expect(resolveAgentConfiguredAcpBackend({ cfg, agentId: "quantum" })).toBe(
      "openclaw-quantum-acp",
    );
    expect(resolveAcpBackendForAgent({ cfg, agentId: "quantum", metadataBackend: "acpx" })).toBe(
      "openclaw-quantum-acp",
    );
  });

  it("falls back through metadata backend and global backend", () => {
    const cfg = {
      acp: { backend: "acpx" },
      agents: {
        list: [{ id: "codex", runtime: { type: "acp" } }],
      },
    } as OpenClawConfig;

    expect(resolveAcpBackendForAgent({ cfg, agentId: "codex", metadataBackend: "recorded" })).toBe(
      "recorded",
    );
    expect(resolveAcpBackendForAgent({ cfg, agentId: "missing" })).toBe("acpx");
  });
});
