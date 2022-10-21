"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processOmitExtensionConfig = exports.formatExtensions = void 0;
function formatExtensions(extensions) {
    return extensions.map((extension) => extension.startsWith(".") ? extension : `.${extension}`);
}
exports.formatExtensions = formatExtensions;
function processOmitExtensionConfig(assets, extensionConfig, mode) {
    const shouldOmitExtension = typeof extensionConfig === "boolean"
        ? extensionConfig
        : extensionConfig[mode];
    if (shouldOmitExtension)
        return assets.map((asset) => asset.slice(0, asset.lastIndexOf(".")));
    return mode === "assetsType"
        ? assets
        : assets.map((asset) => {
            const extensionStartIndex = asset.lastIndexOf(".");
            const extension = asset.substring(extensionStartIndex + 1);
            return (asset.substring(extensionStartIndex) +
                extension.charAt(0).toUpperCase() +
                extension.slice(1));
        });
}
exports.processOmitExtensionConfig = processOmitExtensionConfig;
