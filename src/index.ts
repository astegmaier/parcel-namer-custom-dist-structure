import { Namer } from "@parcel/plugin";
import type { Bundle } from "@parcel/types";
import path from "path";
import { IProcessedConfig, processConfig, isConfig } from "./config";

export default new Namer<IProcessedConfig | undefined>({
  async loadConfig({ config }) {
    const configAndPath = await config.getConfig(["package.json"], { packageKey: "customDistStructure" });
    // TODO: should we throw errors if there is a half-valid config?
    // TODO: should we pick a default structure that you get with no config?
    const userConfig = isConfig(configAndPath?.contents) ? configAndPath?.contents : undefined;
    return processConfig(userConfig);
  },

  name({ bundle, config, options }) {
    if (options.mode !== "development" || config?.options?.development) {
      const folderName = config?.extensionToFolderMap[bundle.type];
      if (folderName) return getPathWithFolder(folderName, bundle);
    }
    return null;
  },
});

function getPathWithFolder(folderName: string, bundle: Bundle): string | null {
  const filePath = bundle.getMainEntry()?.filePath;
  if (!filePath) return null;
  let nameWithoutExtension = path.basename(filePath, path.extname(filePath));
  if (!bundle.needsStableName) {
    // See: https://parceljs.org/plugin-system/namer/#content-hashing
    nameWithoutExtension += "." + bundle.hashReference;
  }
  return `${folderName}/${nameWithoutExtension}.${bundle.type}`;
}
