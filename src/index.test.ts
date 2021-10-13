import Parcel, { createWorkerFarm } from "@parcel/core";
import { InitialParcelOptions } from "@parcel/types";
import { NodeFS, MemoryFS, FileSystem } from "@parcel/fs";
import path from "path";

describe("parcel-namer-custom-dist-structure", () => {
  let options: InitialParcelOptions;
  let outputFS: FileSystem;
  const distDir: string = path.join(__dirname, "dist");
  const configDir: string = path.join(__dirname, ".parcelrc-no-reporters");
  const entries: string = path.join(__dirname, "test");
  beforeEach(() => {
    const workerFarm = createWorkerFarm({ maxConcurrentWorkers: 0 });
    const inputFS = new NodeFS();
    outputFS = new MemoryFS(workerFarm);
    options = {
      entries,
      shouldDisableCache: true,
      logLevel: "none",
      defaultConfig: configDir,
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
  });
  it("bundles a basic project", async () => {
    const parcel = new Parcel(options);
    expect(parcel).toBeDefined();
    await parcel.run();
    const outputFileNames = await outputFS.readdir(distDir);
    expect(outputFileNames).toEqual(["index.html", "a.js", "a.js.map"]);
  });
});
