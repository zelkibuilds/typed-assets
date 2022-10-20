"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAssetTypes = void 0;
const promises_1 = require("node:fs/promises");
const node_child_process_1 = require("node:child_process");
const node_path_1 = __importDefault(require("node:path"));
const DEFAULTS = {
    filename: "asset-types.ts",
    type: "Asset",
};
async function generateAssetTypes({ inputDir, outputDir, validExtensions, outFilename = DEFAULTS.filename, type = DEFAULTS.type, prettierFormat, }) {
    const outFilePath = node_path_1.default.join(outputDir, outFilename);
    const assets = await (0, promises_1.readdir)(inputDir);
    const matchingAssets = assets.filter((asset) => validExtensions.some((validExtension) => asset.endsWith(validExtension)));
    const discriminatedUnion = matchingAssets.join(" | ");
    const fileContent = `export type ${type} = ${discriminatedUnion};`;
    await (0, promises_1.writeFile)(outFilePath, fileContent);
    if (!prettierFormat)
        return;
    (0, node_child_process_1.exec)(`prettier --write ${outFilePath}`);
}
exports.generateAssetTypes = generateAssetTypes;
