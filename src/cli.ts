#!/usr/bin/env node
import type {
  Config,
  ResolvedConfig,
  ResolvedConfigEntry,
  AliasConfig,
} from "./types";

import path from "node:path";
import { readdir } from "node:fs/promises";

import { validateEntry, validateAliasConfig } from "./validator";
import { generateAssetsType } from "./type-generators/discrimininated-union";
import { generateAssetsMapping } from "./type-generators/mapping";
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

  const resolvedConfig = await handleAliasedPaths(config);

  await Promise.all(
    resolvedConfig.entries.map((entry) =>
      processEntry(entry, Boolean(config.prettierFormat))
    )
  );
})();

async function processEntry(entry: ResolvedConfigEntry, globalFormat: boolean) {
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

  return Promise.all([
    generateAssetsType(matchingAssets, mergedConfigEntry),
    generateAssetsMapping(matchingAssets, mergedConfigEntry),
  ]);
}

async function handleAliasedPaths(config: Config): Promise<ResolvedConfig> {
  if (config.aliasedPaths) {
    let tsConfig: AliasConfig;

    try {
      tsConfig = await import(tsConfigPath);
    } catch (e) {
      throw new Error(
        "`aliasedPath` option requires missing tsconfig.json file at project root"
      );
    }

    validateAliasConfig(tsConfig);

    const resolvedEntries = config.entries.map((aliasedEntry) =>
      resolveAliasedEntry(aliasedEntry, tsConfig)
    );

    return {
      ...config,
      entries: resolvedEntries,
    };
  } else {
    return {
      ...config,
      entries: config.entries.map((entry) => ({
        ...entry,
        aliasedInputDir: null,
        aliasedOutputDir: null,
      })),
    };
  }
}
