import Parcel, { createWorkerFarm } from "@parcel/core";
import { InitialParcelOptions, BuildEvent } from "@parcel/types";
import { NodeFS, MemoryFS, FileSystem, OverlayFS } from "@parcel/fs";
import path from "path";

const DEFAULT_CONFIG_PATH: string = path.join(__dirname, ".parcelrc.test");

const DEFAULT_DIST_PATH = "dist";

const inputFS = new NodeFS();

/** Configuration options that tests can use to control parcel behavior. */
interface IBundlerConfig {
  /** the path to the entry file of the project (e.g. index.html or index.js). */
  entryPath: string;
  /** the path to the .parcelrc file used for this run. */
  configPath?: string;
  /** The mode to run parcel in. */
  mode?: "production" | "development";
}

/** Stuff that tests need to interact with parcel output and input. */
interface IBundlerTools {
  /** An in-memory file system of the resulting output that can be inspected by tests. */
  outputFS: FileSystem;
  /** An in-memory filesystem that can be modified by tests to simulate the user changing input files */
  overlayFS: FileSystem;
  /** The path to the output files in that file system. */
  distDir: string;
}

interface IBundler extends IBundlerTools {
  parcel: Parcel;
}

/**
 * Creates a Parcel instance with correct configuration and mock fileSystems that is ready to bundle or watch.
 */
export function bundler({ entryPath, configPath, mode }: IBundlerConfig): IBundler {
  const workerFarm = createWorkerFarm({ maxConcurrentWorkers: 0 });
  const outputFS = new MemoryFS(workerFarm);
  const overlayFS = new OverlayFS(outputFS, inputFS);
  const distDir = path.join(path.dirname(entryPath), DEFAULT_DIST_PATH);

  const options: InitialParcelOptions = {
    entries: entryPath,
    shouldDisableCache: true,
    logLevel: "none",
    defaultConfig: configPath ?? DEFAULT_CONFIG_PATH,
    mode: mode ?? "production",
    inputFS: overlayFS,
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
  return { parcel, outputFS, overlayFS, distDir };
}

/** Bundles a test project with parcel. */
export async function bundle(config: IBundlerConfig): Promise<IBundlerTools> {
  const { parcel, ...bundlerTools } = bundler(config);
  await parcel.run();
  return { ...bundlerTools };
}

/** When parcel is running in watch mode, this will wait for the next build to complete. */
export function getNextBuild(b: Parcel): Promise<BuildEvent> {
  return new Promise((resolve, reject) => {
    const subscriptionPromise = b
      .watch((err, buildEvent) => {
        if (err) {
          reject(err);
          return;
        }
        subscriptionPromise
          .then((subscription) => {
            // If the watch callback was reached, subscription must have been successful
            if (subscription == null) throw new Error("subscription doesn't exist");
            return subscription.unsubscribe();
          })
          .then(() => {
            // If the build promise hasn't been rejected, buildEvent must exist
            if (buildEvent == null) throw new Error("buildEvent doesn't exist");
            resolve(buildEvent);
          })
          .catch(reject);
      })
      .catch(reject);
  });
}
