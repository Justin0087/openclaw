/**
 * Local gateway request-context tests.
 */
import { afterEach, beforeAll, describe, expect, it } from "vitest";
import type { CliDeps } from "../cli/deps.types.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
import {
  createLocalGatewayRequestContext,
  withLocalGatewayRequestScope,
} from "./local-request-context.js";
import { resetGatewayNodeRegistryForTests } from "./node-registry-global.js";
import { createGatewayNodeSessionRuntime } from "./server-node-session-runtime.js";
import { dispatchGatewayMethodInProcessRaw } from "./server-plugins.js";

describe("local gateway request context", () => {
  let response: Awaited<ReturnType<typeof dispatchGatewayMethodInProcessRaw>>;

  afterEach(() => {
    resetGatewayNodeRegistryForTests();
  });

  beforeAll(async () => {
    const cfg = {
      agents: {
        defaults: {},
      },
    } as OpenClawConfig;

    response = await withLocalGatewayRequestScope(
      {
        deps: {} as CliDeps,
        getRuntimeConfig: () => cfg,
      },
      () =>
        dispatchGatewayMethodInProcessRaw("agent.identity.get", {
          agentId: "main",
        }),
    );
  });

  it("lets embedded local runs dispatch gateway methods in-process", () => {
    expect(response.ok).toBe(true);
    expect(response.payload).toMatchObject({ agentId: "main" });
  });

  it("reuses the live gateway node registry when creating embedded local contexts", () => {
    const cfg = { agents: { defaults: {} } } as OpenClawConfig;
    const runtime = createGatewayNodeSessionRuntime({ broadcast: () => {} });

    const context = createLocalGatewayRequestContext({
      deps: {} as CliDeps,
      getRuntimeConfig: () => cfg,
    });

    expect(context.nodeRegistry).toBe(runtime.nodeRegistry);
  });
});
