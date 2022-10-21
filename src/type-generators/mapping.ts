import type { ResolvedConfigEntry, OmitExtensionsConfig } from "../types";

import { exec } from "node:child_process";
import { writeFile } from "node:fs/promises";

type AssetsMappingConfig = ResolvedConfigEntry;

export async function generateAssetsMapping(
  assets: string[],
  config: AssetsMappingConfig
) {}
