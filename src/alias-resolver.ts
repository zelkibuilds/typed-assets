import type { ConfigEntry, AliasConfig } from "./types";

import path from "node:path";

export function resolveAliasedEntry(
  entry: ConfigEntry,
  config: AliasConfig
): ConfigEntry {
  const { baseUrl, paths } = config.compilerOptions;

  const accumulator: Record<string, string> = {};

  const aliasMap = Object.keys(paths).reduce((acc, alias) => {
    const [aliasValue] = paths[alias];

    const key = alias.split("/*")[0];
    const value = path.join(baseUrl, aliasValue).split("/*")[0];

    acc[key] = value;
    return acc;
  }, accumulator);

  return {
    ...entry,
    inputDir: resolveAliasedPath(entry.inputDir, aliasMap),
    outputDir: resolveAliasedPath(entry.outputDir, aliasMap),
  };
}

function resolveAliasedPath(path: string, aliasMap: Record<string, string>) {
  const aliases = Object.keys(aliasMap);
  const matchingAlias = aliases.find((alias) => path.startsWith(alias));

  return matchingAlias
    ? path.replace(matchingAlias, aliasMap[matchingAlias])
    : path;
}
