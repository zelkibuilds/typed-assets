#!/usr/bin/env node
import type { Config, ConfigEntry, AliasConfig } from "./types";

import path from "node:path";
import { readdir } from "node:fs/promises";

import { validateEntry, validateAliasConfig } from "./validator";
import { generateAssetsType } from "./type-generators/discrimininated-union";
import { resolveAliasedEntry } from "./alias-resolver";
import { formatExtensions } from "./helpers/extensions";

const configFilename = "typed-assets.config.cjs";
const configPath = path.resolve(configFilename);
const tsConfigPath = path.resolve("tsconfig.json");

(async function executeGenerateAssetTypes() {
  let config: Config;

  try {
    config = await import(configPath);
  } catch (e) {
    console.error("Error(typed-assets): missing config file", e);
    return;
  }

  if (config.aliasedPaths) {
    let tsConfig: AliasConfig;

    try {
      tsConfig = await import(tsConfigPath);
    } catch (e) {
      console.error(
        "`aliasedPath` option requires missing tsconfig.json file at project root"
      );
      return;
    }

    validateAliasConfig(tsConfig);

    const resolvedEntries = config.entries.map((aliasedEntry) =>
      resolveAliasedEntry(aliasedEntry, tsConfig)
    );

    config = {
      ...config,
      entries: resolvedEntries,
    };
  }

  await Promise.all(
    config.entries.map((entry) =>
      processEntry(entry, Boolean(config.prettierFormat))
    )
  );
})();

async function processEntry(entry: ConfigEntry, globalFormat: boolean) {
  validateEntry(entry);

  const assets = await readdir(entry.inputDir);
  const validExtensions = formatExtensions(entry.validExtensions);
  const matchingAssets = assets.filter((asset) =>
    validExtensions.some((validExtension) => asset.endsWith(validExtension))
  );

  if (matchingAssets.length === 0) {
    return;
  }

  const mergedConfigEntry = {
    ...entry,
    prettierFormat: globalFormat || Boolean(entry.prettierFormat),
    omitExtension: entry.omitExtension ?? false,
  };

  return Promise.all([generateAssetsType(matchingAssets, mergedConfigEntry)]);
}
