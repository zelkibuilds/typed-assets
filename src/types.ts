export type ConfigEntry = {
  inputDir: string;
  outputDir: string;
  validExtensions: string[];
  outFilename?: string;
  type?: string;
  prettierFormat?: boolean;
};

export type Config = {
  entries: ConfigEntry[];
  prettierFormat?: boolean;
};
