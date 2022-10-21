import type { ConfigEntry, OmitExtensionsConfig } from "../types";

import path from "node:path";
import { exec } from "node:child_process";
import { writeFile } from "node:fs/promises";
import { processOmitExtensionConfig } from "../helpers/extensions";

const DEFAULTS = {
  filename: "asset-types.ts",
  type: "Asset",
} as const;

type AssetsTypeConfig = Pick<
  ConfigEntry,
  "outputDir" | "prettierFormat" | "type" | "typeFilename"
> & { omitExtension: OmitExtensionsConfig };

export async function generateAssetsType(
  assets: string[],
  config: AssetsTypeConfig
) {
  const {
    outputDir: outDir,
    typeFilename: outFile = DEFAULTS.filename,
    omitExtension,
    prettierFormat,
    type = DEFAULTS.type,
  } = config;
  const preparedAssets = processOmitExtensionConfig(
    assets,
    omitExtension,
    "assetsType"
  );

  const assetTypeFilePath = path.join(outDir, outFile);

  const discriminatedUnion = preparedAssets
    .map((asset) => `'${asset}'`)
    .join(" | ");

  const fileContent = `export type ${type} = ${discriminatedUnion};`;

  await writeFile(assetTypeFilePath, fileContent);

  if (!prettierFormat) return;

  exec(`prettier --write ${assetTypeFilePath}`);
}
