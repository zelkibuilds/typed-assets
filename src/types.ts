export type ConfigEntry = {
  inputDir: string;
  outputDir: string;
  validExtensions: string[];
  typeFilename?: string;
  mappingsFilename?: string;
  type?: string;
  prettierFormat?: boolean;
  omitExtension?: OmitExtensionsConfig;
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

export type OutputTargets = "assetsType" | "assetsMapping";

export type OmitExtensionsConfig =
  | boolean
  | { [key in OutputTargets]?: boolean };
