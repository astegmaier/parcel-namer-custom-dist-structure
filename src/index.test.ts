import Parcel, { createWorkerFarm } from "@parcel/core";
import { InitialParcelOptions } from "@parcel/types";
import { NodeFS, MemoryFS, FileSystem } from "@parcel/fs";
import path from "path";

describe("parcel-namer-custom-dist-structure", () => {
  const distDir: string = path.join(__dirname, "dist");
  const configFile: string = path.join(__dirname, ".parcelrc");
  const entries: string = path.join(__dirname, "test");

  const inputFS = new NodeFS();
  let outputFS: FileSystem;
  let options: InitialParcelOptions;

  beforeEach(() => {
    const workerFarm = createWorkerFarm({ maxConcurrentWorkers: 0 });
    outputFS = new MemoryFS(workerFarm);
    options = {
      entries,
      shouldDisableCache: true,
      logLevel: "none",
      defaultConfig: configFile,
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

  it("puts .js bundles in a 'scripts' folder", async () => {
    const parcel = new Parcel(options);
    await parcel.run();

    const output = await outputFS.readdir(distDir);
    expect(output).toEqual(["scripts", "index.html"]);

    const scriptsOutput = await outputFS.readdir(path.join(distDir, "scripts"));
    expect(scriptsOutput).toEqual(["a.js", "a.js.map"]);
  });
});
