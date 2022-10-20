import type { ConfigEntry, AliasConfig } from "./types";

import invariant from "tiny-invariant";

export function validateEntry(configEntry: ConfigEntry) {
  invariant(
    configEntry.inputDir && configEntry.inputDir.length !== 0,
    "Input directory missing"
  );

  invariant(
    configEntry.outputDir && configEntry.outputDir.length !== 0,
    "Output directory missing"
  );

  invariant(
    configEntry.validExtensions && configEntry.validExtensions.length !== 0,
    "Valid extensions missing"
  );
}

export function validateAliasConfig(tsConfig: AliasConfig) {
  invariant(
    tsConfig.compilerOptions,
    "`compilerOptions` missing from tsconfig.json"
  );

  invariant(
    tsConfig.compilerOptions.baseUrl,
    "`baseUrl` missing from `compilerOptions` in tsconfig.json"
  );

  invariant(
    tsConfig.compilerOptions.paths,
    "`paths` missing from `compilerOptions` in tsconfig.json"
  );
}
