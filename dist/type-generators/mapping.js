"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAssetsMapping = void 0;
const node_path_1 = __importDefault(require("node:path"));
const node_child_process_1 = require("node:child_process");
const promises_1 = require("node:fs/promises");
/* @ts-ignore */
const varname_1 = __importDefault(require("varname"));
const enums_1 = require("./enums");
const extensions_1 = require("../helpers/extensions");
const messages_1 = require("../constants/messages");
async function generateAssetsMapping(assets, config) {
    const { aliasedInputDir, inputDir, aliasedOutputDir, outputDir: outDir, type = enums_1.Default.type, typeFilename: outTypeFile = enums_1.Default.filename, mappingsFilename: outMappingsFile = enums_1.Default.mappingsFilename, omitExtension, prettierFormat, } = config;
    const preparedAssets = (0, extensions_1.processOmitExtensionConfig)(assets, omitExtension, "assetsMapping");
    const assetVarnames = preparedAssets.map((asset) => varname_1.default.camelback(asset));
    const importAssetTypeFragment = `import type { ${type} } from "${aliasedOutputDir ?? outDir}/${outTypeFile}";\n\n`;
    const importsFragment = assetVarnames.map((asset, index) => `import ${asset} from "${aliasedInputDir ?? inputDir}/${assets[index]}";`);
    const exportsFragment = `{
    ${assetVarnames.join(", ")}
  }`;
    const typedExportsFragment = `\n\nconst mapping: Record<${type}, string> = ${exportsFragment};\n\nexport default mapping;`;
    const fileContent = `${messages_1.CODE_GENERATION.generatedFileHeader}${importAssetTypeFragment}${importsFragment.join("\n")}${typedExportsFragment}`;
    const outPath = node_path_1.default.join(outDir, `${outMappingsFile}.ts`);
    await (0, promises_1.writeFile)(outPath, fileContent);
    if (!prettierFormat)
        return;
    (0, node_child_process_1.exec)(`prettier --write ${outPath}`);
}
exports.generateAssetsMapping = generateAssetsMapping;
