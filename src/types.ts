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

export interface ResolvedConfigEntry extends ConfigEntry {
  aliasedInputDir: string | null;
  aliasedOutputDir: string | null;
}

export type Config = {
  entries: ConfigEntry[];
  prettierFormat?: boolean;
  aliasedPaths?: boolean;
};

export interface ResolvedConfig extends Config {
  entries: ResolvedConfigEntry[];
}

export type OutputTargets = "assetsType" | "assetsMapping";

export type OmitExtensionsConfig =
  | boolean
  | { [key in OutputTargets]?: boolean };

export type AliasConfig = {
  compilerOptions: {
    baseUrl: string;
    paths: Record<string, string[]>;
  };
};
