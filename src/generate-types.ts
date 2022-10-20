import type { ConfigEntry } from "./types";

import { readdir, writeFile } from "node:fs/promises";
import { exec } from "node:child_process";
import path from "node:path";

const DEFAULTS = {
  filename: "asset-types.ts",
  type: "Asset",
} as const;

export async function generateAssetTypes({
  inputDir,
  outputDir,
  validExtensions,
  outFilename = DEFAULTS.filename,
  type = DEFAULTS.type,
  prettierFormat,
  omitExtension = false,
}: ConfigEntry) {
  const outFilePath = path.join(outputDir, outFilename);
  const assets = await readdir(inputDir);
  let matchingAssets = assets.filter((asset) =>
    validExtensions.some((validExtension) => asset.endsWith(validExtension))
  );

  if (matchingAssets.length === 0) {
    return;
  }

  if (omitExtension) {
    matchingAssets = matchingAssets.map((asset) =>
      asset.slice(0, asset.lastIndexOf("."))
    );
  }

  const discriminatedUnion = matchingAssets
    .map((asset) => `'${asset}'`)
    .join(" | ");
  const fileContent = `export type ${type} = ${discriminatedUnion};`;

  await writeFile(outFilePath, fileContent);

  if (!prettierFormat) return;

  exec(`prettier --write ${outFilePath}`);
}
