const pkg = require("../../package.json");

export const CODE_GENERATION = {
  generatedFileHeader: `/* file generated by \`typed-assets@${pkg.version}\` */\n\n`,
} as const;
