"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveAliasedEntry = void 0;
const node_path_1 = __importDefault(require("node:path"));
function resolveAliasedEntry(entry, config) {
    const { baseUrl, paths } = config.compilerOptions;
    const accumulator = {};
    const aliasMap = Object.keys(paths).reduce((acc, alias) => {
        const [aliasValue] = paths[alias];
        const key = alias.split("/*")[0];
        const value = node_path_1.default.join(baseUrl, aliasValue).split("/*")[0];
        acc[key] = value;
        return acc;
    }, accumulator);
    return {
        ...entry,
        aliasedInputDir: isAliased(entry.inputDir, aliasMap)
            ? entry.inputDir
            : null,
        aliasedOutputDir: isAliased(entry.outputDir, aliasMap)
            ? entry.outputDir
            : null,
        inputDir: resolveAliasedPath(entry.inputDir, aliasMap),
        outputDir: resolveAliasedPath(entry.outputDir, aliasMap),
    };
}
exports.resolveAliasedEntry = resolveAliasedEntry;
function isAliased(path, aliasMap) {
    const aliases = Object.keys(aliasMap);
    const matchingAlias = aliases.find((alias) => path.startsWith(alias));
    return Boolean(matchingAlias);
}
function resolveAliasedPath(path, aliasMap) {
    const aliases = Object.keys(aliasMap);
    const matchingAlias = aliases.find((alias) => path.startsWith(alias));
    return matchingAlias
        ? path.replace(matchingAlias, aliasMap[matchingAlias])
        : path;
}
