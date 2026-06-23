import type { NodeRegistry } from "./node-registry.js";

const GATEWAY_NODE_REGISTRY_KEY = Symbol.for("openclaw.gateway.nodeRegistry");

type GatewayNodeRegistryGlobal = typeof globalThis & {
  [GATEWAY_NODE_REGISTRY_KEY]?: NodeRegistry;
};

function registryGlobal(): GatewayNodeRegistryGlobal {
  return globalThis as GatewayNodeRegistryGlobal;
}

export function setGatewayNodeRegistry(registry: NodeRegistry): void {
  registryGlobal()[GATEWAY_NODE_REGISTRY_KEY] = registry;
}

export function getGatewayNodeRegistry(): NodeRegistry | undefined {
  return registryGlobal()[GATEWAY_NODE_REGISTRY_KEY];
}

export function resetGatewayNodeRegistryForTests(): void {
  delete registryGlobal()[GATEWAY_NODE_REGISTRY_KEY];
}
