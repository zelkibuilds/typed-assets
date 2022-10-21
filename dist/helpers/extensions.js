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
    return shouldOmitExtension
        ? assets.map((asset) => asset.slice(0, asset.lastIndexOf(".")))
        : assets;
}
exports.processOmitExtensionConfig = processOmitExtensionConfig;
