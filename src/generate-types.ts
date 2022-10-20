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
}: ConfigEntry) {
  const outFilePath = path.join(outputDir, outFilename);
  const assets = await readdir(inputDir);
  const matchingAssets = assets.filter((asset) =>
    validExtensions.some((validExtension) => asset.endsWith(validExtension))
  );

  const discriminatedUnion = matchingAssets.join(" | ");
  const fileContent = `export type ${type} = ${discriminatedUnion};`;

  await writeFile(outFilePath, fileContent);

  if (!prettierFormat) return;

  exec(`prettier --write ${outFilePath}`);
}
