#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_path_1 = __importDefault(require("node:path"));
const promises_1 = require("node:fs/promises");
const validator_1 = require("./validator");
const discrimininated_union_1 = require("./type-generators/discrimininated-union");
const mapping_1 = require("./type-generators/mapping");
const alias_resolver_1 = require("./alias-resolver");
const extensions_1 = require("./helpers/extensions");
const configFilename = "typed-assets.config.cjs";
const configPath = node_path_1.default.resolve(configFilename);
const tsConfigPath = node_path_1.default.resolve("tsconfig.json");
(async function executeGenerateAssetTypes() {
    let config;
    try {
        config = await Promise.resolve().then(() => __importStar(require(configPath)));
    }
    catch (e) {
        console.error("Error(typed-assets): missing config file", e);
        return;
    }
    const resolvedConfig = await handleAliasedPaths(config);
    await Promise.all(resolvedConfig.entries.map((entry) => processEntry(entry, Boolean(config.prettierFormat))));
})();
async function processEntry(entry, globalFormat) {
    (0, validator_1.validateEntry)(entry);
    const assets = await (0, promises_1.readdir)(entry.inputDir);
    const validExtensions = (0, extensions_1.formatExtensions)(entry.validExtensions);
    const matchingAssets = assets.filter((asset) => validExtensions.some((validExtension) => asset.endsWith(validExtension)));
    if (matchingAssets.length === 0) {
        return;
    }
    const mergedConfigEntry = {
        ...entry,
        prettierFormat: globalFormat || Boolean(entry.prettierFormat),
        omitExtension: entry.omitExtension ?? false,
    };
    return Promise.all([
        (0, discrimininated_union_1.generateAssetsType)(matchingAssets, mergedConfigEntry),
        (0, mapping_1.generateAssetsMapping)(matchingAssets, mergedConfigEntry),
    ]);
}
async function handleAliasedPaths(config) {
    if (config.aliasedPaths) {
        let tsConfig;
        try {
            tsConfig = await Promise.resolve().then(() => __importStar(require(tsConfigPath)));
        }
        catch (e) {
            throw new Error("`aliasedPath` option requires missing tsconfig.json file at project root");
        }
        (0, validator_1.validateAliasConfig)(tsConfig);
        const resolvedEntries = config.entries.map((aliasedEntry) => (0, alias_resolver_1.resolveAliasedEntry)(aliasedEntry, tsConfig));
        return {
            ...config,
            entries: resolvedEntries,
        };
    }
    else {
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
