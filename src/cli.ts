#!/usr/bin/env node
import type { Config, ConfigEntry } from "./types";

import path from "node:path";
import { validate } from "./validator";
import { generateAssetTypes } from "./generate-types";

const configFilename = "typed-assets.config.ts";
const configPath = path.resolve(configFilename);

(async function executeGenerateAssetTypes() {
  let config: Config;
  try {
    config = await import(configPath);
  } catch (e) {
    console.error("Error(typed-assets): missing config file");
    return;
  }

  await Promise.all(
    config.entries.map((entry) =>
      processEntry(entry, Boolean(config.prettierFormat))
    )
  );
})();

async function processEntry(entry: ConfigEntry, globalFormat: boolean) {
  validate(entry);

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
