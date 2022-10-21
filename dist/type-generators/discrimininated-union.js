"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAssetsType = void 0;
const node_path_1 = __importDefault(require("node:path"));
const node_child_process_1 = require("node:child_process");
const promises_1 = require("node:fs/promises");
const extensions_1 = require("../helpers/extensions");
const enums_1 = require("./enums");
async function generateAssetsType(assets, config) {
    const { outputDir: outDir, typeFilename: outFile = enums_1.Default.filename, omitExtension, prettierFormat, type = enums_1.Default.type, } = config;
    const preparedAssets = (0, extensions_1.processOmitExtensionConfig)(assets, omitExtension, "assetsType");
    const assetTypeFilePath = node_path_1.default.join(outDir, outFile);
    const discriminatedUnion = preparedAssets
        .map((asset) => `'${asset}'`)
        .join(" | ");
    const fileContent = `export type ${type} = ${discriminatedUnion};`;
    await (0, promises_1.writeFile)(assetTypeFilePath, fileContent);
    if (!prettierFormat)
        return;
    (0, node_child_process_1.exec)(`prettier --write ${assetTypeFilePath}`);
}
exports.generateAssetsType = generateAssetsType;
