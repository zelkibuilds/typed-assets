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
const validator_1 = require("./validator");
const generate_types_1 = require("./generate-types");
const alias_resolver_1 = require("./alias-resolver");
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
    if (config.aliasedPaths) {
        let tsConfig;
        try {
            tsConfig = await Promise.resolve().then(() => __importStar(require(tsConfigPath)));
        }
        catch (e) {
            console.error("`aliasedPath` option requires missing tsconfig.json file at project root");
            return;
        }
        (0, validator_1.validateAliasConfig)(tsConfig);
        const resolvedEntries = config.entries.map((aliasedEntry) => (0, alias_resolver_1.resolveAliasedEntry)(aliasedEntry, tsConfig));
        config = {
            ...config,
            entries: resolvedEntries,
        };
    }
    await Promise.all(config.entries.map((entry) => processEntry(entry, Boolean(config.prettierFormat))));
})();
async function processEntry(entry, globalFormat) {
    (0, validator_1.validateEntry)(entry);
    return (0, generate_types_1.generateAssetTypes)({
        ...entry,
        validExtensions: formatExtensions(entry.validExtensions),
        prettierFormat: globalFormat || entry.prettierFormat,
    });
}
function formatExtensions(extensions) {
    return extensions.map((extension) => extension.startsWith(".") ? extension : `.${extension}`);
}
