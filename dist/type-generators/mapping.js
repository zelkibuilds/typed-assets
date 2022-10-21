"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAssetsMapping = void 0;
const node_path_1 = __importDefault(require("node:path"));
const node_child_process_1 = require("node:child_process");
const promises_1 = require("node:fs/promises");
const enums_1 = require("./enums");
const extensions_1 = require("../helpers/extensions");
async function generateAssetsMapping(assets, config) {
    const { inputDir, aliasedInputDir, aliasedOutputDir, outputDir: outDir, type = enums_1.Default.type, typeFilename: outTypeFile = enums_1.Default.filename, mappingsFilename: outMappingsFile = enums_1.Default.mappingsFilename, omitExtension, prettierFormat, } = config;
    const preparedAssets = (0, extensions_1.processOmitExtensionConfig)(assets, omitExtension, "assetsMapping");
    const importAssetTypeFragment = `import type ${type} from "${aliasedOutputDir ?? outDir}/${outTypeFile}";\n`;
    const importsFragment = preparedAssets.map((asset, index) => `import ${asset} from "${aliasedInputDir ?? inputDir}/${assets[index]}";\n`);
    const exportsFragment = `{
    ${preparedAssets.join(", ")}
  };`;
    const typedExportsFragment = `const mapping: Record<${type}, string> = ${exportsFragment};\nexport default mapping;`;
    const fileContent = `${importAssetTypeFragment} ${importsFragment} ${typedExportsFragment}`;
    const outPath = node_path_1.default.join(outDir, outMappingsFile);
    await (0, promises_1.writeFile)(outPath, fileContent);
    if (!prettierFormat)
        return;
    (0, node_child_process_1.exec)(`prettier --write ${outPath}`);
}
exports.generateAssetsMapping = generateAssetsMapping;
