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
const configFilename = "typed-assets.config.ts";
const configPath = node_path_1.default.resolve(configFilename);
(async function executeGenerateAssetTypes() {
    const config = await Promise.resolve().then(() => __importStar(require(configPath)));
    await Promise.all(config.entries.map((entry) => processEntry(entry, Boolean(config.prettierFormat))));
})();
async function processEntry(entry, globalFormat) {
    (0, validator_1.validate)(entry);
    return (0, generate_types_1.generateAssetTypes)({
        ...entry,
        validExtensions: formatExtensions(entry.validExtensions),
        prettierFormat: globalFormat || entry.prettierFormat,
    });
}
function formatExtensions(extensions) {
    return extensions.map((extension) => extension.startsWith(".") ? extension : `.${extension}`);
}
