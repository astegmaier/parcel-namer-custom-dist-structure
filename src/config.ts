/** Configuration that the user can supply to this plugin through package.json */
export interface IConfig {
  config?: IStructureConfig;
  options?: IOptions;
}

/** Other options related to the plugin. */
interface IOptions {
  /* Enable plugin in development mode (default: false) */
  development?: boolean;
}

/** Configuration that maps extensions to folder names and/or vice-versa. */
interface IStructureConfig {
  [folderOrExtension: string]: string | string[];
}

/** Checks whether something is a valid IConfig object. */
export function isConfig(thing: unknown): thing is IConfig {
  return (
    typeof thing === "object" &&
    thing !== null &&
    ((thing as IConfig).config === undefined || isStructureConfig((thing as IConfig).config)) &&
    ((thing as IConfig).options === undefined || isOptions((thing as IConfig).options))
  );
}

/** Checks whether something is a valid IOptions object. */
function isOptions(thing: unknown): thing is IOptions {
  return (
    typeof thing === "object" &&
    thing !== null &&
    ((thing as IOptions).development === undefined || typeof (thing as IOptions).development === "boolean")
  );
}

/** Checks whether something is a valid IStructureConfig object. */
function isStructureConfig(thing: unknown): thing is IStructureConfig {
  return (
    typeof thing === "object" &&
    thing !== null &&
    Object.entries(thing).every(
      ([key, value]) =>
        typeof key === "string" &&
        (typeof value === "string" || (Array.isArray(value) && value.every((arrayItem) => typeof arrayItem === "string")))
    )
  );
}

/** A config object that also contains a map corresponding to the user configuration that can be used to quickly lookup the right folder for a given file. */
export interface IProcessedConfig extends IConfig {
  extensionToFolderMap: {
    [extension: string]: string;
  };
}

/** Generates IProcessedConfig from a valid, user-supplied IConfig object. */
export function processConfig(config?: IConfig): IProcessedConfig | undefined {
  if (!config) return undefined;
  const extensionToFolderMap: { [extension: string]: string } = {};
  if (config.config) {
    Object.entries(config.config).forEach(([folderOrExtension, folderOrExtensionArray]) => {
      // If the entry is an array, we know we are dealing with a folder => extension list item. (e.g. "images": [".jpg", ".png"])
      if (Array.isArray(folderOrExtensionArray)) {
        folderOrExtensionArray.forEach((extension) => {
          extensionToFolderMap[stripLeadingDot(extension)] = folderOrExtension;
        });
      }
      // Otherwise, we're dealing with a normal extension => folder item. (e.g. ".png": "images")
      else {
        extensionToFolderMap[stripLeadingDot(folderOrExtension)] = folderOrExtensionArray;
      }
    });
  }
  return { ...config, extensionToFolderMap };
}

/** Strips the leading "dot" from an extension name, if it exists. (e.g. ".js" => "js") */
function stripLeadingDot(extension: string): string {
  return extension.charAt(0) === "." ? extension.substr(1) : extension;
}
