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

  if (shouldOmitExtension)
    return assets.map((asset) => asset.slice(0, asset.lastIndexOf(".")));

  return mode === "assetsType"
    ? assets
    : assets.map((asset) => {
        const extensionStartIndex = asset.lastIndexOf(".");
        const extension = asset.substring(extensionStartIndex + 1);

        return (
          asset.substring(extensionStartIndex) +
          extension.charAt(0).toUpperCase() +
          extension.slice(1)
        );
      });
}
