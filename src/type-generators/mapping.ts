import type { ResolvedConfigEntry, OmitExtensionsConfig } from "../types";

import path from "node:path";
import { exec } from "node:child_process";
import { writeFile } from "node:fs/promises";

import { Default } from "./enums";
import { processOmitExtensionConfig } from "../helpers/extensions";

type GenerateMappingState = Omit<ResolvedConfigEntry, "validExtensions">;

interface AssetsMappingConfig extends GenerateMappingState {
  omitExtension: OmitExtensionsConfig;
}

export async function generateAssetsMapping(
  assets: string[],
  config: AssetsMappingConfig
) {
  const {
    inputDir,
    aliasedInputDir,
    aliasedOutputDir,
    outputDir: outDir,
    type = Default.type,
    typeFilename: outTypeFile = Default.filename,
    mappingsFilename: outMappingsFile = Default.mappingsFilename,
    omitExtension,
    prettierFormat,
  } = config;

  const preparedAssets = processOmitExtensionConfig(
    assets,
    omitExtension,
    "assetsMapping"
  );

  const importAssetTypeFragment = `import type ${type} from "${
    aliasedOutputDir ?? outDir
  }/${outTypeFile}";\n`;

  const importsFragment = preparedAssets.map(
    (asset, index) =>
      `import ${asset} from "${aliasedInputDir ?? inputDir}/${
        assets[index]
      }";\n`
  );

  const exportsFragment = `{
    ${preparedAssets.join(", ")}
  };`;

  const typedExportsFragment = `const mapping: Record<${type}, string> = ${exportsFragment};\nexport default mapping;`;

  const fileContent = `${importAssetTypeFragment} ${importsFragment} ${typedExportsFragment}`;

  const outPath = path.join(outDir, outMappingsFile);

  await writeFile(outPath, fileContent);

  if (!prettierFormat) return;

  exec(`prettier --write ${outPath}`);
}
