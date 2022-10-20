"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const tiny_invariant_1 = __importDefault(require("tiny-invariant"));
function validate(configEntry) {
    (0, tiny_invariant_1.default)(configEntry.inputDir && configEntry.inputDir.length !== 0, "Input directory missing");
    (0, tiny_invariant_1.default)(configEntry.outputDir && configEntry.outputDir.length !== 0, "Output directory missing");
    (0, tiny_invariant_1.default)(configEntry.validExtensions && configEntry.validExtensions.length !== 0, "Valid extensions missing");
}
exports.validate = validate;
