export interface IUserConfig {
  // TODO: do we want to mirror the existing custom-dist-structure plugin, where there is also an "options" section that controls whether the custom structure affects dev builds?
  [folderOrExtension: string]: string | string[];
}

/** Checks if an item is a valid UserConfig object. */
export function isUserConfig(thing: unknown): thing is IUserConfig {
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

export interface IProcessedConfig {
  extensionToFolderMap: {
    [extension: string]: string;
  };
}

export function processConfig(config?: IUserConfig): IProcessedConfig | undefined {
  if (!config) return undefined;
  const extensionToFolderMap: { [extension: string]: string } = {};
  Object.entries(config).forEach(([folderOrExtension, folderOrExtensionArray]) => {
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
  return { extensionToFolderMap };
}

/** Strips the leading "dot" from an extension name, if it exists. (e.g. ".js" => "js") */
function stripLeadingDot(extension: string): string {
  // TODO: how should we handle extension names with two dots in them (e.g. ".d.ts")? Need to add tests
  return extension.charAt(0) === "." ? extension.substr(1) : extension;
}
