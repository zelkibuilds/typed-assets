"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAliasConfig = exports.validateEntry = void 0;
const tiny_invariant_1 = __importDefault(require("tiny-invariant"));
function validateEntry(configEntry) {
    (0, tiny_invariant_1.default)(configEntry.inputDir && configEntry.inputDir.length !== 0, "Input directory missing");
    (0, tiny_invariant_1.default)(configEntry.outputDir && configEntry.outputDir.length !== 0, "Output directory missing");
    (0, tiny_invariant_1.default)(configEntry.validExtensions && configEntry.validExtensions.length !== 0, "Valid extensions missing");
}
exports.validateEntry = validateEntry;
function validateAliasConfig(tsConfig) {
    (0, tiny_invariant_1.default)(tsConfig.compilerOptions, "`compilerOptions` missing from tsconfig.json");
    (0, tiny_invariant_1.default)(tsConfig.compilerOptions.baseUrl, "`baseUrl` missing from `compilerOptions` in tsconfig.json");
    (0, tiny_invariant_1.default)(tsConfig.compilerOptions.paths, "`paths` missing from `compilerOptions` in tsconfig.json");
}
exports.validateAliasConfig = validateAliasConfig;
