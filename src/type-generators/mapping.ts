import type { ResolvedConfigEntry, OmitExtensionsConfig } from "../types";

import path from "node:path";
import { exec } from "node:child_process";
import { writeFile } from "node:fs/promises";
/* @ts-ignore */
import varname from "varname";

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

  const assetVarnames = preparedAssets.map((asset) => varname.camelback(asset));

  const importAssetTypeFragment = `import type { ${type} } from "${
    aliasedOutputDir ?? outDir
  }/${outTypeFile}";\n\n`;

  const importsFragment = assetVarnames.map(
    (asset, index) =>
      `import ${asset} from "${aliasedOutputDir ?? outDir}/${assets[index]}";`
  );

  const exportsFragment = `{
    ${assetVarnames.join(", ")}
  }`;

  const typedExportsFragment = `\n\nconst mapping: Record<${type}, string> = ${exportsFragment};\n\nexport default mapping;`;

  const fileContent = `${importAssetTypeFragment}${importsFragment.join(
    "\n"
  )}${typedExportsFragment}`;

  const outPath = path.join(outDir, `${outMappingsFile}.ts`);

  await writeFile(outPath, fileContent);

  if (!prettierFormat) return;

  exec(`prettier --write ${outPath}`);
}
