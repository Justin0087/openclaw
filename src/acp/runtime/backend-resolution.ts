import type { OpenClawConfig } from "../../config/types.openclaw.js";
import { normalizeAgentId } from "../../routing/session-key.js";
import { normalizeOptionalString } from "@openclaw/normalization-core/string-coerce";

function normalizeBackendId(value: string | undefined | null): string | undefined {
  return normalizeOptionalString(value);
}

export function resolveAgentConfiguredAcpBackend(params: {
  cfg: OpenClawConfig;
  agentId: string | undefined | null;
}): string | undefined {
  const targetAgentId = normalizeAgentId(params.agentId);
  for (const agent of params.cfg.agents?.list ?? []) {
    if (normalizeAgentId(agent.id) !== targetAgentId) {
      continue;
    }
    if (agent.runtime?.type !== "acp") {
      return undefined;
    }
    return normalizeBackendId(agent.runtime.acp?.backend);
  }
  return undefined;
}

export function resolveAcpBackendForAgent(params: {
  cfg: OpenClawConfig;
  agentId: string | undefined | null;
  metadataBackend?: string | undefined | null;
}): string | undefined {
  return (
    resolveAgentConfiguredAcpBackend({ cfg: params.cfg, agentId: params.agentId }) ??
    normalizeBackendId(params.metadataBackend) ??
    normalizeBackendId(params.cfg.acp?.backend)
  );
}
