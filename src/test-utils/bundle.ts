import Parcel, { createWorkerFarm } from "@parcel/core";
import { InitialParcelOptions } from "@parcel/types";
import { NodeFS, MemoryFS, FileSystem } from "@parcel/fs";
import path from "path";

const CONFIG_WITH_PLUGIN: string = path.join(__dirname, ".parcelrc.test");

const DEFAULT_DIST_PATH = "dist";

const inputFS = new NodeFS();

/**
 * Bundles a test project with parcel.
 * @param projectPath the path to the project files.
 * @param configPath (optional) the path to the .parcelrc file used for this run.
 * @returns an in-memory file system of the resulting output that can be inspected by tests. */
export async function bundle(
  projectDir: string,
  configPath: string = CONFIG_WITH_PLUGIN
): Promise<{ outputFS: FileSystem; distDir: string }> {
  const workerFarm = createWorkerFarm({ maxConcurrentWorkers: 0 });
  const outputFS = new MemoryFS(workerFarm);
  const distDir = path.join(projectDir, DEFAULT_DIST_PATH);

  const options: InitialParcelOptions = {
    entries: projectDir,
    shouldDisableCache: true,
    logLevel: "none",
    defaultConfig: configPath,
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
