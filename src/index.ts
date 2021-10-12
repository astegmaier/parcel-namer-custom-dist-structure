import { Namer } from "@parcel/plugin";
import type { Bundle } from "@parcel/types";
import path from "path";

export default new Namer({
  name({ bundle }) {
    switch (bundle.type) {
      case "js":
        return getPathWithFolder("scripts", bundle);
      case "less":
        return getPathWithFolder("layout", bundle);
      case "css":
        return getPathWithFolder("layout", bundle);
      default:
        return null;
    }
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
