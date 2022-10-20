export type ConfigEntry = {
  inputDir: string;
  outputDir: string;
  validExtensions: string[];
  outFilename?: string;
  type?: string;
  prettierFormat?: boolean;
  omitExtension?: boolean;
};

export type AliasConfig = {
  compilerOptions: {
    baseUrl: string;
    paths: Record<string, string[]>;
  };
};

export type Config = {
  entries: ConfigEntry[];
  prettierFormat?: boolean;
  aliasedPaths?: boolean;
};
