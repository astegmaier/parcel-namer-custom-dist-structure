import Parcel, { createWorkerFarm } from "@parcel/core";
import { InitialParcelOptions } from "@parcel/types";
import { NodeFS, MemoryFS, FileSystem } from "@parcel/fs";
import path from "path";

const CONFIG_WITH_PLUGIN: string = path.join(__dirname, ".parcelrc.test");

const DEFAULT_DIST_PATH = "dist";

const inputFS = new NodeFS();

interface IBundleOverrides {
  /** the path to the .parcelrc file used for this run. */
  configPath?: string;
  /** The mode to run parcel in. */
  mode?: "production" | "development";
}

/**
 * Bundles a test project with parcel.
 * @param entryPath the path to the entry file of the project (e.g. index.html or index.js).
 * @param overrides overrides to the default options for this run.
 * @returns an object with these properties:
 *      "outputFS": an in-memory file system of the resulting output that can be inspected by tests.
 *      "distPath" the path to the output files in that file system.
 */
export async function bundle(entryPath: string, overrides?: IBundleOverrides): Promise<{ outputFS: FileSystem; distDir: string }> {
  const workerFarm = createWorkerFarm({ maxConcurrentWorkers: 0 });
  const outputFS = new MemoryFS(workerFarm);
  const distDir = path.join(path.dirname(entryPath), DEFAULT_DIST_PATH);

  const options: InitialParcelOptions = {
    entries: entryPath,
    shouldDisableCache: true,
    logLevel: "none",
    defaultConfig: overrides?.configPath ?? CONFIG_WITH_PLUGIN,
    mode: overrides?.mode ?? "production",
    inputFS,
    outputFS,
    workerFarm,
    shouldContentHash: true,
    defaultTargetOptions: {
      distDir,
      engines: {
        browsers: ["last 1 Chrome version"],
        node: "8",
      },
    },
  };

  const parcel = new Parcel(options);
  await parcel.run();

  return { outputFS, distDir };
}
