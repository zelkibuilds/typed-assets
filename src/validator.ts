import type { ConfigEntry } from "./types";

import invariant from "tiny-invariant";

export function validate(configEntry: ConfigEntry) {
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
