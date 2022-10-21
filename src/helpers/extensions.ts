import type { OmitExtensionsConfig, OutputTargets } from "../types";

export function formatExtensions(extensions: string[]) {
  return extensions.map((extension) =>
    extension.startsWith(".") ? extension : `.${extension}`
  );
}

export function processOmitExtensionConfig(
  assets: string[],
  extensionConfig: OmitExtensionsConfig,
  mode: OutputTargets
) {
  const shouldOmitExtension =
    typeof extensionConfig === "boolean"
      ? extensionConfig
      : extensionConfig[mode];

  return shouldOmitExtension
    ? assets.map((asset) => asset.slice(0, asset.lastIndexOf(".")))
    : assets;
}
