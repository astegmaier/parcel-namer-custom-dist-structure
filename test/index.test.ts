import path from "path";
import { bundle } from "./bundle";

describe("parcel-namer-custom-dist-structure", () => {
  it("puts .js bundles in a 'scripts' folder, based on configuration", async () => {
    const { outputFS, distDir } = await bundle(path.join(__dirname, "projects/simple/src/index.html"));
    const output = await outputFS.readdir(distDir);
    expect(output.sort()).toEqual(["index.html", "scripts"]);

    const scriptsOutput = await outputFS.readdir(path.join(distDir, "scripts"));
    expect(scriptsOutput.sort()).toEqual(["a.b586da9e.js", "a.b586da9e.js.map"]);
  });

  it.skip("Invalidates cache when config changes", () => {
    throw new Error("Not Implemented");
  });

  it.skip("Does not invalidate cache when unrelated parts of package.json change", () => {
    throw new Error("Not Implemented");
  });

  it.skip("Can handle a mixture of both folder => extension[] entries and extension => folder entries", () => {
    throw new Error("Not Implemented");
  });

  it.skip("Can handle extensions with multiple parts (e.g. '.d.ts')", () => {
    throw new Error("Not Implemented");
  });

  it.skip("Throws an error when an invalid configuration is present", () => {
    throw new Error("Not Implemented");
  });

  it.skip("Can handle multiple build targets gracefully without conflict", () => {
    throw new Error("Not Implemented");
  });

  it.skip("Can handle projects where package.json (with config) is at the same level of folder as the target", () => {
    throw new Error("Not Implemented");
  });

  it("By default, bundling in development mode ignores dist structure customization", async () => {
    const { outputFS, distDir } = await bundle(path.join(__dirname, "projects/simple/src/index.html"), { mode: "development" });
    const output = await outputFS.readdir(distDir);
    expect(output.sort()).toEqual(["index.da070317.js", "index.da070317.js.map", "index.html"]);
  });

  it("Setting options:development: true, causes dist structure customization to be respected in development mode", async () => {
    const { outputFS, distDir } = await bundle(path.join(__dirname, "projects/development-true/src/index.html"), { mode: "development" });
    const output = await outputFS.readdir(distDir);
    expect(output.sort()).toEqual(["index.html", "scripts"]);

    const scriptsOutput = await outputFS.readdir(path.join(distDir, "scripts"));
    expect(scriptsOutput.sort()).toEqual(["a.fbc58559.js", "a.fbc58559.js.map"]);
  });

  it.skip("Should not append content hashes to content types that need stable names (e.g. HTML, linked references, libraries.)", async () => {
    throw new Error("Not Implemented");
  });
});
