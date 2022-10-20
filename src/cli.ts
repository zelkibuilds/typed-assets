#!/usr/bin/env node
import type { Config, ConfigEntry, AliasConfig } from "./types";

import path from "node:path";
import { validateEntry, validateAliasConfig } from "./validator";
import { generateAssetTypes } from "./generate-types";
import { resolveAliasedEntry } from "./alias-resolver";

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

  return generateAssetTypes({
    ...entry,
    validExtensions: formatExtensions(entry.validExtensions),
    prettierFormat: globalFormat || entry.prettierFormat,
  });
}

function formatExtensions(extensions: string[]) {
  return extensions.map((extension) =>
    extension.startsWith(".") ? extension : `.${extension}`
  );
}
