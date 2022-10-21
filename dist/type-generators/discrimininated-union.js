"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAssetsType = void 0;
const node_path_1 = __importDefault(require("node:path"));
const node_child_process_1 = require("node:child_process");
const promises_1 = require("node:fs/promises");
/* @ts-ignore */
const varname_1 = __importDefault(require("varname"));
const extensions_1 = require("../helpers/extensions");
const enums_1 = require("./enums");
const messages_1 = require("../constants/messages");
async function generateAssetsType(assets, config) {
    const { outputDir: outDir, typeFilename: outFile = enums_1.Default.filename, omitExtension, prettierFormat, type = enums_1.Default.type, } = config;
    const preparedAssets = (0, extensions_1.processOmitExtensionConfig)(assets, omitExtension, "assetsType");
    const assetTypeFilePath = `${node_path_1.default.join(outDir, outFile)}.ts`;
    const discriminatedUnion = preparedAssets
        .map((asset) => `'${varname_1.default.camelback(asset)}'`)
        .join(" | ");
    const fileContent = `${messages_1.CODE_GENERATION.generatedFileHeader}export type ${type} = ${discriminatedUnion};`;
    await (0, promises_1.writeFile)(assetTypeFilePath, fileContent);
    if (!prettierFormat)
        return;
    (0, node_child_process_1.exec)(`prettier --write ${assetTypeFilePath}`);
}
exports.generateAssetsType = generateAssetsType;
